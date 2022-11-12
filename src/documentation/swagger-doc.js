const { serverRouteDoc, userRouteDoc } = require('./user-doc')

const swaggerDocumentation = {
    openapi: "3.0.0",
    info: {
        title: "HangoutPadie App",
        version: "1.0.0",
        description: "A hub for information on ticketing hangout locations and centers in Africa"
    },
    servers: [
        {
            url: `http://localhost:5000`,
            description: "Local Dev"
        },
        {
            url: "",
            description: "Production Dev"
        },
    ],
    tags: [
        {
            name: "Server",
            description: "Server routes"
        },
        {
            name: "User",
            description: "User Routes"
        },
       
        
    ],
    paths: {
        ...serverRouteDoc,
        ...userRouteDoc,
        
        
    },
    
};

module.exports= swaggerDocumentation;
