const serverList = [
  {
    "success": true,
    "message": "welcome to HangoutPadie api, our sweat documentation is on this url endpoint : http://localhost:442/documentations ",
    "note": "should you need any assistance kindly contact our surport "
  }
]
const server = {
    tags: ["Server"],
    description: "Test and get a response from server",
    responses: {
      200: {
        description: "Ok",
        content: {
          "application/json": {
            schema: {
              type: "object",
              example: serverList[0]
            },
          },
        },
      },
    },
};
  
const serverRouteDoc = {
    "/hangoutPadie": {
      get: server,
    },
};
  
const userList = [
  {
    "message": "User created"
  },
  {
    "success": false,
    "message": "Unable to register user with error: ValidationError: \"name\" is required"
  }
]

const createUser = {
  tags: ["User"],
  description: "Create a user",
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            email: {
              type: "string",
              description: "Email of the user",
              example: "namacab552@mahazai.com",
            },
            name: {
              type: "string",
              description:
                "Full name of the user, minimum lenght: 3, ",
              example: "Samuel Omolaja",
            },
            role: {
              type: "string",
              description:
                "Role should either be vendor or user",
              example: "user",
            },
            password: {
              type: "string",
              description:
                "A unique password of the user with a combination of capital letter, small letter, numbers and signs, minimum lenght: 6, max. lenght: 16",
              example: "Gxo@k.123ftz-f",
              confirmPassword: {
                type: "string",
                description:
                  "A unique password of the user with a combination of capital letter, small letter, numbers and signs, minimum lenght: 6, max. lenght: 16",
                example: "Gxo@k.123ftz-f",
              },
            },
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: userList[0],
          },
        },
      },
    },
    404: {
      description: "Not Found",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: userList[1],
          },
        },
      },
    },
  }
}

const userRouteDoc = {
  "/api/signUp": {
      post:createUser
    }
}

module.exports= {serverRouteDoc,userRouteDoc}