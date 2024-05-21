import React from 'react';

export default function SimpleForm() {
    return (
       
            <form className="panel max-w-2xl w-full mx-auto border space-y-4">
                <div className="text-center py-5">
                    <h3 className="text-2xl font-semibold">Get Started</h3>
                </div>
                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" name="name" id="name" className="form-input" />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" id="email" className="form-input" />
                </div>
                <div>
                    <label htmlFor="phone">Phone</label>
                    <input type="tel" name="phone" id="phone" className="form-input" />
                </div>
                <div>
                    <label htmlFor="message">Message</label>
                    <textarea name="message" id="message" rows={6} className="form-textarea"></textarea>
                </div>
                <div>
                    <button type="submit" className="btn-dark btn w-full">
                        Submit
                    </button>
                </div>
            </form>
       
    );
}
