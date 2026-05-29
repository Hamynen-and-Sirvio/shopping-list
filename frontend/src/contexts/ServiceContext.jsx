import { createContext, useContext } from 'react'

const ServiceContext = createContext(null)

export const ServiceProvider = ({ services, children }) => {
  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  )
}

export const useServices = () => {
  return useContext(ServiceContext)
}
