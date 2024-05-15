import { createContext, useContext, useEffect, useState } from 'react';
import { UserAuth } from './AuthContext';
import fetchData from '../functions/fetchdata';

const MarketingContext: any = createContext<any>(null);

export default function MarketingContextProvider({ children }: any) {
    const { studioInfo, suid, studioOptions }: any = UserAuth();
    

    
    
    
    return (
        <MarketingContext.Provider
            value={{
                
            }}
        >
            {children}
        </MarketingContext.Provider>
    );
}

export const MarketingCon = () => {
    return useContext(MarketingContext);
};
