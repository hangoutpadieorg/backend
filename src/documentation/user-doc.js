
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
    "message": "Validation Error : \"name\" is required"
  },
  {
    "success": false,
    "message": "A user with this email already exists, please choose another email"
  },
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjM2Y2YyYmY3MTNjMzcwNDlmNzFhNjAzIiwicm9sZSI6InVzZXIiLCJlbWFpbCI6Im5lZTIycmVwa3lAd2F0ZXJpc2dvbmUuY29tIiwibmFtZSI6InVuZGVmaW5lZCB1bmRlZmluZWQiLCJpYXQiOjE2Njg0Mjc2MzQsImV4cCI6MTY2ODUxNDAzNH0.gXXo2cKytZ8HqKEOIFp2UyqPwmEv6RmuGEcSpDQFlvM",
    "expiresIn": "1d"
  },
  {
    "success": false,
    "message": "There is no user found with this email"
  },
  {
    "success": false,
    "message": "Password is not correct"
  },
  {
    "success": false,
    "message": "Invalid OTP"
  },
  {
    "success": false,
    "message": "Validation Error : \"OTP\" is required"
  },
  {
    "message": "Email verification success",
    "success": true
  },
  {
    "success": false,
    "message": "Email already verified"
  },
  {
    "success": true,
    "message": "Please check your email."
  },
  {
    "success": false,
    "message": "Validation Error : \"email\" is required"
  },
  {
    "success": true,
    "message": "Password reset successfully"
  },
  {
    "success": false,
    "message": "Password already set"
  },
  {
  "success": false,
  "message": "Unauthorized Access, Please login"
  },
  {
  "success": false,
  "message": "New password and old password can't be same"
  },
  {
    "success": true,
    "message": "Password successfully updated"
  },
  {
    "success": false,
    "message": "Validation Error : \"password\" is required"
  },
  {
    "success": false,
    "message": "Authorization token can not be empty"
  },
  {
    "success": false,
    "message": "Unauthenticated Token!:jwt expired "
  },
  {
    "success": true,
    "message": "Sign out successfully"
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
              example: "Gxo@k.123ftz",
            },
            confirmPassword: {
              type: "string",
              description:
                "A unique password of the user with a combination of capital letter, small letter, numbers and signs, minimum lenght: 6, max. lenght: 16",
              example: "Gxo@k.123ftz",
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
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: userList[1],
          },
        },
      },
    },
   
    409: {
      description: "Conflict",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: userList[2],
          },
        },
      },
    },
  }
};

const signIn = {
  tags: ["User"],
  description: "SignIn a user using these endpoint",
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
            
            password: {
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
  responses: {
    200: {
      description: "Ok",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: userList[3],
          },
        },
      },
    },
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: userList[11],
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
            example: userList[4],
          },
        },
      },
    },
    406: {
      description: "Not Acceptable",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: userList[5],
          },
        },
      },
    },
  }
  
};

const activateAccount = {
  tags: ["User"],
  description: "These endpoint allows you to activate a user with otp they receive while registering , a user may not be able to signin without activating there account first",
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            OTP: {
              type: "number",
              description: "OTP received via mail",
              example: "418551",
            },
          },
        },
      },
    },
  },
  responses: {
    202: {
      description: "Ok",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: userList[8],
          },
        },
      },
    },
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: userList[7],
          },
        },
      },
    },
    406: {
      description: "Not Acceptable",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: userList[6],
          },
        },
      },
    },
    409: {
      description: "Not Acceptable",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: userList[9],
          },
        },
      },
    },
  }
};

const forgotPassword = {
  tags: ["User"],
  description: "These endpoint allows you to reset a user password",
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            email: {
              type: "string",
              description: "User email",
              example: "nee22repky@waterisgone.com",
            },
          },
        },
      },
    },
  },
  responses: {
    200: {
      description: "Ok",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: userList[10],
          },
        },
      },
    },
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: userList[11],
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
            example: userList[4],
          },
        },
      },
    },
    
  }
};

const resetPassword = {
  tags: ["User"],
  description: "Reset user password with this endpoint",
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            OTP: {
              type: "number",
              description: "OTP received via mail",
              example: "418551",
            },
            password: {
              type: "string",
              description:
                "A unique password of the user with a combination of capital letter, small letter, numbers and signs, minimum lenght: 6, max. lenght: 16",
              example: "Gxo@k.123ftz-f",
            },
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
  responses: {
    202: {
      description: "Accepted",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: userList[12],
          },
        },
      },
    },
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: userList[11],
          },
        },
      },
    },
    
    409: {
      description: "Conflict",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: userList[13],
          },
        },
      },
    },
    406: {
      description: "Not Acceptable",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: userList[6],
          },
        },
      },
    },
  }
};

const changePassword = {
  tags: ["User"],
  description: "An already loggedIn user can reset his password using this endpoint",
  requestBody: {
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            password: {
              type: "string",
              description:
                "A unique password of the user with a combination of capital letter, small letter, numbers and signs, minimum lenght: 6, max. lenght: 16",
              example: "Gxo@k.123ftz",
            },
            confirmPassword: {
              type: "string",
              description:
                "A unique password of the user with a combination of capital letter, small letter, numbers and signs, minimum lenght: 6, max. lenght: 16",
              example: "Gxo@k.123ftz",
            },
          },
        },
      },
    },
  },
  responses: {
    202: {
      description: "Accepted",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: userList[16],
          },
        },
      },
    },
    400: {
      description: "Bad Request",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: userList[17],
          },
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: userList[14],
          },
        },
      },
    },
    406: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: userList[18],
          },
        },
      },
    },
    409: {
      description: "Conflict",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: userList[15],
          },
        },
      },
    },
   
  }
};

const logOut = {
  tags: ["User"],
  description: "An already loggedIn user can reset his password using this endpoint",
  responses: {
    200: {
      description: "ok",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: userList[16],
          },
        },
      },
    },
    401: {
      description: "Unauthorized",
      content: {
        "application/json": {
          schema: {
            type: "object",
            example: userList[19],
          },
        },
      },
    },
  }
}

const userRouteDoc = {
  "/api/signUp": {
      post:createUser
  },
  "/api/signIn": {
    post:signIn
  },
  "/api/activateAccount": {
    post:activateAccount
  },
  "/api/forgotPassword": {
    post:forgotPassword
  },
  "/api/resetPassword": {
    patch:resetPassword
  },
  "/api/changePassword": {
    patch:changePassword
  },
  "/api/signOut": {
    delete:logOut
  }
}

module.exports= {serverRouteDoc,userRouteDoc}