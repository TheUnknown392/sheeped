import '../css/AdminForm.css';
import { useState, useContext, useEffect } from 'react'

import { getToken } from '../imports/jwt.js'
import { SessionContext } from '../component/SessionProvider.jsx';


async function getCharge(setCharge) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/charge`,{
            method: "GET",
            headers: {
                "Content-Type"  : "application/json",
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch charge.");
        }

        const data = await response.json();
        setCharge(data.charge);
    } catch (err) {
        console.error(err);
    }
}

async function getCategories(token, setCategories) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/category`,{
            method: "GET",
            headers: {
                "Content-Type"  : "application/json",
                "Authorization" : "Bearer " + token
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch categories.");
        }

        const data = await response.json();
        setCategories(data);
    } catch (err) {
        console.error(err);
    }
}

async function getCountries(token, setCountries) {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/country`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization" : "Bearer " + token
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch countries.");
        }

        const data = await response.json();
        setCountries(data);
    } catch (err) {
        console.error(err);
    }
}

async function getTaxes(token, setTaxes){
    try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/taxes`,{
            method: "GET",
            headers: {
                "Content-Type"  : "application/json",
                "Authorization" : "Bearer " + token
            }
        });

        if (!response.ok) {
            throw new Error("Failed to fetch taxes.");
        }

        const data = await response.json();
        setTaxes(data);
    } catch (err) {
        console.error(err);
    }
}

// requestId/linkId identify exactly which item within which request this popup
// is quoting or rejecting - AdminRequestList passes these in from the row the
// admin clicked "Fill" on.
export default function ProductPopup({ isOpen, onClose, onSubmit, requestId, linkId }) {

    const { refreshSession } = useContext(SessionContext);
    const token = getToken();

    const [taxes, setTaxes] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [taxRate, setTaxRate] = useState('');
    const [charge, setCharge] = useState(null);

    const [categories, setCategories] = useState([]);
    const [countries, setCountries] = useState([]);

    const [basePrice, setBasePrice] = useState('');
    const [domesticShipping, setDomesticShipping] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // todo: somehow extract this logout flow. can't use logout.jsx as that's a hook
    //       remove this code duplication
    useEffect(() => {
        if (!token) {
            localStorage.clear();
            refreshSession();
        }
    }, [token, refreshSession]);

    useEffect(() => {
        if (!token) return;
        getCategories(token, setCategories);
        getCountries(token, setCountries);
        getTaxes(token, setTaxes);
        getCharge(setCharge);
    }, [token]);


    // taxRate auto-fills from the category+country match but stays a normal
    // editable field (admin can override when no matching Tax entry exists
    // yet - the server trusts that override in exactly that case). Syncing an
    // external computed value into editable local state is one of the
    // legitimate uses of an effect here.
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (selectedCategory && selectedCountry && taxes) {
            const matchingTax = taxes.find(tax => tax.category_id === selectedCategory._id && tax.country_id === selectedCountry._id);

            if (matchingTax) {
                const taxPercentage = ((matchingTax.Tax_per - 1) * 100).toFixed(2);
                setTaxRate(taxPercentage);
            } else {
                setTaxRate('0');
            }
        }
    }, [selectedCategory, selectedCountry, taxes]);
    /* eslint-enable react-hooks/set-state-in-effect */

    function handleCategoryChange(e) {
        const selected = categories.find(c => c._id === e.target.value);
        setSelectedCategory(selected ?? null);
    }

    function handleCountryChange(e) {
        const selected = countries.find(c => c._id.toString() === e.target.value);
        setSelectedCountry(selected ?? null);
    }

    if (!isOpen) return null;

    const previewPrice = parseFloat(basePrice) || 0;
    const previewDomShipping = parseFloat(domesticShipping) || 0;
    const previewTaxRate = parseFloat(taxRate) || 0;
    const previewIntShipping = selectedCountry?.shipping ?? 0;
    const previewTotal = (selectedCategory && selectedCountry && basePrice !== '')
          ? (previewPrice * (1 + previewTaxRate / 100) + previewDomShipping + previewIntShipping + (charge ?? 0)).toFixed(2)
          : null;

    async function handleSendQuote(e) {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/product/requestdetail`,{
                method: "POST",
                headers: {
                    "Content-Type"  : "application/json",
                    "Authorization" : "Bearer " + token
                },
                body: JSON.stringify({
                    action: "quote",
                    requestId,
                    linkId,
                    category: selectedCategory?._id,
                    country: selectedCountry?._id,
                    basePrice: previewPrice,
                    taxRate: previewTaxRate,
                    domesticShipping: previewDomShipping
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to send quote.");
            }

            onSubmit(data.requestDetail);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    async function handleReject() {
        setError('');
        setSubmitting(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/product/requestdetail`,{
                method: "POST",
                headers: {
                    "Content-Type"  : "application/json",
                    "Authorization" : "Bearer " + token
                },
                body: JSON.stringify({
                    action: "reject",
                    requestId,
                    linkId
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to reject request.");
            }

            onSubmit(data.requestDetail);
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="popup-overlay">
            <div className="popup">

                <button className="close-btn" onClick={onClose} type="button">
                    ✕
                </button>

                <h2>Send Quote</h2>
                <form onSubmit={handleSendQuote}>

                    <div className="form-group">
                        <label>Category</label>
                        <select
                            name="category"
                            value={selectedCategory ? selectedCategory._id : ""}
                            onChange={handleCategoryChange}
                            required
                        >
                            <option value="">Select Category</option>

                            {categories.map(c => (
                                <option key={c._id} value={c._id}>
                                    {c.category_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Country</label>
                        <select
                            name="country"
                            value={selectedCountry ? selectedCountry._id : ""}
                            onChange={handleCountryChange}
                            required
                        >
                            <option value="">Select Country</option>

                            {countries.map(c => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Base Price</label>
                        <input
                            type="number"
                            name="basePrice"
                            step="0.01"
                            min="0"
                            value={basePrice}
                            onChange={(e) => setBasePrice(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Tax Rate (%)</label>
                        <input
                            type="number"
                            name="taxRate"
                            step="0.01"
                            min="0"
                            value={taxRate}
                            onChange={(e) => setTaxRate(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Domestic Shipping</label>
                        <input
                            type="number"
                            name="domesticShipping"
                            step="0.01"
                            min="0"
                            value={domesticShipping}
                            onChange={(e) => setDomesticShipping(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>International Shipping</label>
                        <input
                            type="number"
                            name="internationalShipping"
                            value={selectedCountry?.shipping ?? ""}
                            readOnly
                        />
                    </div>

                    <div className="charge-box">
                        <span>Service Charge</span>
                        <strong>{charge !== null ? `NRS ${charge}` : "Loading..."}</strong>
                    </div>

                    {previewTotal !== null && (
                        <div className="quote-total">
                            Customer Total
                            <strong>NRS {previewTotal}</strong>
                        </div>
                    )}

                    {error && <p className="popup-error">{error}</p>}

                    <div className="popup-buttons">
                        <button
                            type="submit"
                            className="admin-btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? "Sending..." : "Send Quote"}
                        </button>

                        <button
                            type="button"
                            className="admin-btn-ghost"
                            onClick={handleReject}
                            disabled={submitting}
                        >
                            Reject
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
