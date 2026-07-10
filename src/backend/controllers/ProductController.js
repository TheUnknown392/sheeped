import mongoose from "mongoose"
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

import { signUser, getExpSec, jwtVerify } from '../utils/jwt.js'
import Request from '../models/RequestModel.js'
import RequestDetail from '../models/RequestDetailModel.js'
import Order from '../models/OrderModel.js'
import Country from '../models/CountryModel.js'
import Category from '../models/CategoryModel.js'
import Tax from '../models/TaxModel.js'
import CHARGE from '../utils/charge.js'


const addRequest = async (req, res) => {
    const {
        items,
        notes,
        Authorization
    } = req.body;
    console.log(items, notes, Authorization);



    var userToken = jwtVerify(Authorization);

    if(!userToken){
        res.status(403).json({
            message: "Token is not valid anymore"
        });
        return;
    }
    
    try{
        const newRequest = await Request.create({
            user_id : userToken.id,
            links   : items.map((item) => ({
                url      : item.url,
                name     : item.name,
                quantity : item.qty
            })),
            description  : notes
        });
        console.log("saved");
        res.status(200).json({
            message: "Request Recieved"
        });
    }catch(err){
        res.status(500).json({
            message: "Could not save to database",
            err: err.message
        });
    }
}

const recentRequest = async (req, res) => {
    try {
        const page = Math.max(1, parseInt(req.params.page) || 1);
        const limit = 10;

        // Get every request
        const allRequests = await Request.find()
            .populate("user_id", "firstName lastName")
            .sort({ createdAt: -1 });

        const rows = [];

        allRequests.forEach(request => {

            if (!request.user_id) return;

            request.links.forEach(link => {
                rows.push({
                    id: request._id,
                    linkId: link._id,
                    customer: `${request.user_id.firstName} ${request.user_id.lastName}`,
                    url: link.url,
                    name: link.name,
                    quantity: link.quantity,
                    description: request.description,
                    createdAt: request.createdAt
                });
            });

        });

        const totalRequests = rows.length;
        const totalPages = Math.ceil(totalRequests / limit);

        // Look up quote status for every row (not just this page) in one batched
        // query, so we can also report an accurate "needs attention" count.
        const allLinkIds = rows.map(row => row.linkId);
        const existingDetails = await RequestDetail.find({ link_id: { $in: allLinkIds } })
            .select("link_id status");
        const statusByLink = new Map(
            existingDetails.map(detail => [detail.link_id.toString(), detail.status])
        );

        rows.forEach(row => {
            row.status = statusByLink.get(row.linkId.toString()) || "unquoted";
        });

        const unquotedCount = rows.filter(row => row.status === "unquoted").length;

        const paginatedRows = rows.slice(
            (page - 1) * limit,
            page * limit
        );

        res.status(200).json({
            requests: paginatedRows,
            currentPage: page,
            totalPages,
            totalRequests,
            unquotedCount
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// Admin responds to a single requested item: either sends a priced quote
// (creates a 'pending' RequestDetail the customer can accept/reject) or
// rejects the item outright (creates a 'rejected' RequestDetail, no pricing needed).
const respondToRequest = async (req, res) => {
    const { action, requestId, linkId, category, country, basePrice, taxRate, domesticShipping } = req.body;

    if (!requestId || !linkId || !mongoose.Types.ObjectId.isValid(requestId) || !mongoose.Types.ObjectId.isValid(linkId)) {
        res.status(400).json({
            message: "A valid requestId and linkId are required."
        });
        return;
    }

    try {
        const request = await Request.findById(requestId);

        if (!request) {
            res.status(404).json({ message: "Request not found." });
            return;
        }

        const link = request.links.id(linkId);

        if (!link) {
            res.status(404).json({ message: "That item is not part of this request." });
            return;
        }

        const alreadyHandled = await RequestDetail.findOne({ link_id: linkId });

        if (alreadyHandled) {
            res.status(409).json({ message: "This item has already been responded to." });
            return;
        }

        if (action === "reject") {
            const requestDetail = await RequestDetail.create({
                link_id: linkId,
                request_id: requestId,
                status: "rejected"
            });

            res.status(201).json({
                message: "Request rejected.",
                requestDetail
            });
            return;
        }

        // Anything other than an explicit "reject" is treated as sending a quote,
        // so the required pricing fields are validated below.
        if (!category || !country || !mongoose.Types.ObjectId.isValid(category) || !mongoose.Types.ObjectId.isValid(country)) {
            res.status(400).json({ message: "A valid category and country are required to send a quote." });
            return;
        }

        const price = parseFloat(basePrice);
        const domShipping = parseFloat(domesticShipping);

        if (!Number.isFinite(price) || price < 0) {
            res.status(400).json({ message: "Base price must be a positive number." });
            return;
        }

        if (!Number.isFinite(domShipping) || domShipping < 0) {
            res.status(400).json({ message: "Domestic shipping must be a non-negative number." });
            return;
        }

        const [selectedCountry, selectedCategory, matchingTax] = await Promise.all([
            Country.findById(country),
            Category.findById(category),
            Tax.findOne({ category_id: category, country_id: country })
        ]);

        if (!selectedCountry || !selectedCategory) {
            res.status(404).json({ message: "Selected category or country was not found." });
            return;
        }

        // International shipping and the platform charge are never trusted from the
        // client — always re-derived from the database. Tax rate is authoritative
        // from the Tax table when a category+country entry exists; otherwise there's
        // nothing to check against yet (taxes aren't manageable from the admin UI),
        // so the admin's manually entered rate is trusted for that one-off quote.
        let taxRateValue = matchingTax ? (matchingTax.Tax_per - 1) * 100 : parseFloat(taxRate);

        if (!Number.isFinite(taxRateValue) || taxRateValue < 0) {
            res.status(400).json({ message: "Tax rate must be a non-negative number." });
            return;
        }

        const intShipping = selectedCountry.shipping;
        const totalPrice = Math.round(
            (price * (1 + taxRateValue / 100) + intShipping + domShipping + CHARGE) * 100
        ) / 100;

        const requestDetail = await RequestDetail.create({
            link_id: linkId,
            request_id: requestId,
            category_id: category,
            country_id: country,
            base_price: price,
            tax_rate: taxRateValue,
            int_shipping: intShipping,
            dom_shipping: domShipping,
            charge: CHARGE,
            total_price: totalPrice,
            status: "pending"
        });

        res.status(201).json({
            message: "Quote sent.",
            requestDetail
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// A logged in user's own quotes (RequestDetails), newest first, with enough
// item/pricing info to render and decide on without extra round trips.
const myQuotes = async (req, res) => {
    try {
        const myRequests = await Request.find({ user_id: req.user.id }).select("links");

        const linkById = new Map();
        const requestIds = [];

        myRequests.forEach(request => {
            requestIds.push(request._id);
            request.links.forEach(link => {
                linkById.set(link._id.toString(), link);
            });
        });

        const details = await RequestDetail.find({ request_id: { $in: requestIds } })
            .populate("country_id", "name")
            .populate("category_id", "category_name")
            .sort({ createdAt: -1 });

        const quotes = details.map(detail => {
            const link = linkById.get(detail.link_id.toString());

            return {
                id: detail._id,
                requestId: detail.request_id,
                name: link ? link.name : "(item no longer available)",
                url: link ? link.url : null,
                quantity: link ? link.quantity : null,
                category: detail.category_id ? detail.category_id.category_name : null,
                country: detail.country_id ? detail.country_id.name : null,
                basePrice: detail.base_price,
                taxRate: detail.tax_rate,
                domesticShipping: detail.dom_shipping,
                internationalShipping: detail.int_shipping,
                charge: detail.charge,
                totalPrice: detail.total_price,
                status: detail.status,
                createdAt: detail.createdAt
            };
        });

        res.status(200).json({ quotes });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

// A logged in user accepts or rejects one of their own pending quotes.
// Accepting creates the Order; rejecting just closes out the quote.
const respondToQuote = async (req, res) => {
    const { action } = req.body;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid quote id." });
        return;
    }

    if (action !== "accept" && action !== "reject") {
        res.status(400).json({ message: "action must be 'accept' or 'reject'." });
        return;
    }

    try {
        const requestDetail = await RequestDetail.findById(id);
        if (!requestDetail) {
            res.status(404).json({ message: "Quote not found." });
            return;
        }

        const parentRequest = await Request.findById(requestDetail.request_id);

        if (!parentRequest || parentRequest.user_id.toString() !== req.user.id) {
            res.status(403).json({ message: "This quote does not belong to you." });
            return;
        }

        if (requestDetail.status !== "pending") {
            res.status(409).json({ message: `This quote was already ${requestDetail.status}.` });
            return;
        }

        if (action === "reject") {
            requestDetail.status = "rejected";
            await requestDetail.save();

            res.status(200).json({ message: "Quote rejected.", requestDetail });
            return;
        }

        const order = await Order.create({
            user_id: req.user.id,
            request_detail_id: requestDetail._id,
            charge: requestDetail.charge
            // delivery_status / order_status intentionally left at their schema
            // defaults — see the "verification enum" todo in OrderModel.js.
        });

        requestDetail.status = "accepted";
        await requestDetail.save();

        res.status(201).json({ message: "Order placed.", order });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const myRequests = async (req, res) => {
    try {

        const requests = await Request.find({
            user_id: req.user.id
        }).sort({ createdAt: -1 });

        const requestIds = requests.map(r => r._id);

        const details = await RequestDetail.find({
            request_id: { $in: requestIds }
        });

        const detailMap = new Map();

        details.forEach(detail => {
            detailMap.set(detail.link_id.toString(), detail);
        });

        const items = [];

        requests.forEach(request => {

            request.links.forEach(link => {

                const detail = detailMap.get(link._id.toString());

                items.push({
                    id: detail?._id,
                    requestId: request._id,
                    name: link.name,
                    url: link.url,
                    quantity: link.quantity,
                    description: request.description,

                    status: detail
                        ? detail.status
                        : "waiting",

                    totalPrice: detail?.total_price ?? null,
                    createdAt: request.createdAt
                });

            });

        });

        res.json({
            requests: items
        });

    } catch(err){
        res.status(500).json({
            message: err.message
        });
    }
};

export { addRequest, recentRequest, respondToRequest, myQuotes,myRequests, respondToQuote }
