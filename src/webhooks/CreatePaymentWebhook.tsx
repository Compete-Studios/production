import React, { useState } from 'react';
import { createPaysimpleWebhook, addWebhookToOurDB } from '../functions/payments';
import { UserAuth } from '../context/AuthContext';
import { showMessage, showErrorMessage } from '../functions/shared';

const CreatePaymentWebhook: React.FC = () => {
    const { suid }: any = UserAuth();
    const [loading, setLoading] = useState<boolean>(false);
    
    const createdFailedPaymentWebhook = async () => {
        setLoading(true);
        // Instantiate the data PaySimple requires
        const data = {
            url: 'https://competestudio.com/api/webhooks/failed-payment-endpoint',
            eventType: 'payment_failed',
            studioId: suid,
        }
        // Create the webhook in PaySimple
        try {
            const response = await createPaysimpleWebhook(data);
            if (response.status !== 200) {
                showErrorMessage('Failed to create webhook.' + response.data.message);
                console.log('Failed to create webhook', response);
                return;
            }

            const dbData = {
                studioId: suid,
                webhookId: response.data.id,
                signatureSecret: response.data.signature_secret,
                eventType: 'payment_failed',
            }
            // Add the webhook info to our database
            const dbResponse = await addWebhookToOurDB(dbData);
            if (dbResponse.status !== 200) {
                showErrorMessage('Failed to add webhook to our database.' + dbResponse);
                console.log('Failed to add webhook to our DB', dbResponse);
                return;
            }
            showMessage('Webhook created successfully.');
        } catch (error) {
            console.log('An uncaught error occurred:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Payment Webhook</h1>
            <button
                onClick={createdFailedPaymentWebhook}
                disabled={loading}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? 'Creating...' : 'Create Webhook'}
            </button>
        </div>
    );
};

export default CreatePaymentWebhook;
