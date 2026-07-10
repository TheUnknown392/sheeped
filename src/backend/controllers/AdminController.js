import mongoose from "mongoose"
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'

import { signUser, getExpSec } from '../utils/jwt.js'

import Country from '../models/CountryModel.js'
import Category from '../models/CategoryModel.js'
import Tax from '../models/TaxModel.js'
import User from '../models/UserModel.js'


const addCountry = async (req, res) => {
    try {
        const { name, domestic_currency, shipping } = req.body;

        const country = await Country.create({
            name,
            domestic_currency,
            shipping
        });

        res.status(201).json({
            message: "Country added successfully.",
            country
        });
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};

const addCategory = async (req, res) => {
    try {
        const { category_name } = req.body;

        const category = await Category.create({
            category_name
        });

        res.status(201).json({
            message: "Category added successfully.",
            category
        });
    }
    catch (err) {
        res.status(400).json({
            message: err.message
        });
    }
};


const getUsers = async (req, res) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search || "";
        const role = req.query.role || "all";

        const query = {};

        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: "i" } },
                { lastName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        if (role !== "all") {
            query.role = role;
        }

        const totalUsers = await User.countDocuments(query);

        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .select("-password -token");

        res.json({
            users,
            page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers
        });

    } catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const getCountries = async (req, res) => {
    try {
        const countries = await Country.find().sort({ name: 1 });

        res.status(200).json(countries);
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const getCategories = async (req, res) => {
    try {
        const categories = await Category.find().sort({ category_name: 1 });

        res.status(200).json(categories);
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }
};

const getTaxes = async (req, res) =>{
    try {
        const taxes = await Tax.find().sort({Tax_per: 1 });

        res.status(200).json(taxes);
    }
    catch (err) {
        res.status(500).json({
            message: err.message
        });
    }    
}

export {
    addCountry,
    addCategory,
    getCountries,
    getCategories,
    getTaxes,
    getUsers
};
