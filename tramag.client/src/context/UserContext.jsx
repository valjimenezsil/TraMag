import React, {useContext, createContext, useState, useEffect } from 'react';

 const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = sessionStorage.getItem('user');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const usuario = params.get('usuario');
        const empresa = params.get('empresa');
        const sede = params.get('sede');
        const codapli = 'TraMag';

        if (usuario && empresa && sede) {
            const u = { usuario, empresa, sede, codapli };
            setUser(u);
            sessionStorage.setItem('user', JSON.stringify(u));

        }       
    }, []);
    
        return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    );
}

export const userData = () => useContext(UserContext)