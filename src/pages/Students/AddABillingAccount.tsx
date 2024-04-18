import React from 'react'

export default function AddABillingAccount() {
  return (
    <div>
        <div className='panel'>
            <form>
                <div className='panel-body'>
                    <div className='form-group'>
                        <label htmlFor='name'>Name</label>
                        <input type='text' id='name' className='form-control' />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='address'>Address</label>
                        <input type='text' id='address' className='form-control' />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='city'>City</label>
                        <input type='text' id='city' className='form-control' />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='state'>State</label>
                        <input type='text' id='state' className='form-control' />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='zip'>Zip</label>
                        <input type='text' id='zip' className='form-control' />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='phone'>Phone</label>
                        <input type='text' id='phone' className='form-control' />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='email'>Email</label>
                        <input type='text' id='email' className='form-control' />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='notes'>Notes</label>
                        <textarea id='notes' className='form-control' />
                    </div>
                </div>
                <div className='panel-footer'>
                    <button type='submit' className='btn btn-primary'>Save</button>
                </div>
            </form>
        </div>
    </div>
  )
}
