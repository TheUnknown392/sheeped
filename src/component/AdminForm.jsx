import '../css/AdminForm.css';

import { useState, useContext, useEffect } from 'react'

import { getToken } from '../imports/jwt.js'
import { SessionContext } from '../component/SessionProvider.jsx';

export default function ProductPopup({
    isOpen,
    onClose,
    category,
    country,
    onSubmit
}) {
    const { refreshSession } = useContext(SessionContext);
    const token = getToken();

    // todo: somehow extract this logout flow. can't use logout.jsx as that's a hook
    //       remove this code duplication
    if(!token){
        localStorage.clear();
        refreshSession();
        return;
    }

    const [taxes, setTaxes] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [taxRate, setTaxRate] = useState('');

    useEffect(() => {
        getTaxes();
    }, []);
    
    async function getTaxes(){
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/get/taxes`,{
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
            console.log("taxes:", data);
        } catch (err) {
            console.error(err);
        }
    }


    useEffect(() => {
        if (selectedCategory && selectedCountry && taxes) {

            const matchingTax = taxes.find(tax => tax.category_id === selectedCategory._id && tax.country_id === selectedCountry._id);

            if (matchingTax) {

                const taxPercentage = ((matchingTax.Tax_per - 1) * 100).toFixed(2);
                setTaxRate(taxPercentage);
                console.log(`Tax rate found: ${taxPercentage}%`);
            } else {
                setTaxRate('0');
                console.log('No tax rate found for this combination');
            }
        }
    }, [selectedCategory, selectedCountry, taxes]);

    function handleCategoryChange(e) {
        console.log("Selected Category ID:", e.target.value);

        const selected = category.find(c => c._id === e.target.value);
        setSelectedCategory(selected);

        console.log("Selected category object:", selected);
    }

    function handleCountryChange(e) {
        console.log("Selected Country ID:", e.target.value);

        const selected = country.find(c => c._id.toString() === e.target.value);
        setSelectedCountry(selected);

        console.log("Selected country object:", selected);
    }
    
    if (!isOpen) return null;

    function handleSubmit(e) {
        e.preventDefault();

        const form = new FormData(e.target);

        onSubmit({
            category: form.get("category"),
            country: form.get("country"),
            basePrice: parseFloat(form.get("basePrice")),
            taxRate: parseFloat(form.get("taxRate")),
            domesticShipping: parseFloat(form.get("domesticShipping")),
            internationalShipping: parseFloat(form.get("internationalShipping"))
        });

        onClose();
    }
    
    return (
        <div className="popup-overlay">
            <div className="popup">

                <button
                    className="close-btn"
                    onClick={onClose}
                >
                    ✕
                </button>

                <h2>Add Product</h2>

                <form onSubmit={handleSubmit}>

                    <label>Category</label>
                    <select
                        name="category"
                        value={selectedCategory? selectedCategory._id : ""}
                        onChange={handleCategoryChange}
                        required
                    >
                        <option value="">Select Category</option>

                        {category.map(c => (
                            <option key={c._id} value={c._id}>
                                {c.category_name}
                            </option>
                        ))}
                    </select>
                    
                    <label>Country</label>
                    <select
                        name="country"
                        value={selectedCountry? selectedCountry._id : ""}
                        onChange={handleCountryChange}
                        required
                    >
                        <option value="">Select Country</option>

                        {country.map(c => (
                            <option key={c._id} value={c._id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <label>Base Price</label>
                    <input
                        type="number"
                        name="basePrice"
                        step="0.01"
                        min="0"
                        required
                    />

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
                    
                    <label>Domestic Shipping</label>
                    <input
                        type="number"
                        name="domesticShipping"
                        step="0.01"
                        min="0"
                        required
                    />

                    <label>International Shipping</label>
                    <input
                        type="number"
                        name="internationalShipping"
                        step="0.01"
                        min="0"
                        value={selectedCountry?.shipping ?? ""}
                        readOnly
                        required
                    />
                    
                    <button type="submit">
                        Save
                    </button>

                </form>

            </div>
        </div>
    );
}
