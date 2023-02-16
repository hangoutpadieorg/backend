const HangoutCenterResponseList = [
    {
        "success": true,
        "data": {
          "acknowledged": true,
          "insertedId": "63edf87e4bc61efbcc4cb886"
        }
    },
    {
        "success": false,
        "message": "A HangoutCenter with this email:samlaja1292@gmail.com already exists, please choose another email"
    },
    {
        "success": false,
        "message": "Validation Error : \"name\" is required"
    },
    {
        "success": true,
        "data": [
          {
            "_id": "63de5708d8a6ac800dbb53ab",
            "name": "Radison",
            "openHours": "12pm - 2pm",
            "email": "samlaja1292@gmail.com"
          },
          {
            "_id": "63edf87e4bc61efbcc4cb886",
            "name": "ifitenes",
            "openHours": "12-1pm",
            "email": "samlaja12923@gmail.com",
            "address": "gbadamosi street",
            "phoneNumber": "08161228946",
            "description": "for bars",
            "categories": "bar",
            "gateEntryFee": "#30",
            "bookingCategory": "regular",
            "image": {
              "image1": "images\\1676540030151--.png",
              "image2": "images\\1676540030160--.png",
              "image3": "images\\1676540030189--.png"
            }
          }
        ]
    },
    {
        "success": true,
        "data": {
          "_id": "63edf87e4bc61efbcc4cb886",
          "name": "ifitenes",
          "openHours": "12-1pm",
          "email": "samlaja12923@gmail.com",
          "address": "gbadamosi street",
          "phoneNumber": "08161228946",
          "description": "for bars",
          "categories": "bar",
          "gateEntryFee": "#30",
          "bookingCategory": "regular",
          "image": {
            "image1": "images\\1676540030151--.png",
            "image2": "images\\1676540030160--.png",
            "image3": "images\\1676540030189--.png"
          }
        }
    },
    {
        "success": false,
        "message": "Unable to fetch data because hangout center name does not exist"
    },
    {
        "success": false,
        "message": "Validation Error : \"name\" is required"
      }
]

const hangoutCenterRegistration = {
    tags: ["HangoutCenter"],
    description: "Create a HangoutCenter using form-data",
    requestBody: {
        content: {
          "multipart/form-data": {
            schema: {
              type: "object",
              properties: {
                 name: {
                  type: "string",
                  description:
                    "Full name of the center, minimum word lenght is: 3, ",
                  example: "Radison",
                },
                email: {
                  type: "string",
                  description: "Email of the hangoutCenter",
                  example: "namacab552@mahazai.com",
                },
               
                openHours: {
                  type: "string",
                  description:
                    "Time range of the center",
                  example: "8am-9pm",
                },
                address: {
                  type: "string",
                  description:
                    "Address location of the center ",
                  example: "53, old ipaja road, Ikeja Lagos",
                },
                phoneNumber: {
                  type: "string",
                  description:
                    "Contact phone number of the center, max. lenght: 16",
                  example: "08161228946",
                },
                description: {
                  type: "string",
                  description:
                    "A short description of the hangoutCenter",
                  example: " A bar",
                  },
                  category: {
                    type: "string",
                    description:
                      "The category of the center , should be withing any of the following:['bar', 'lounge', 'cafe', 'restorant', 'park, gardens & reserves', 'cinemas', 'tourist center', 'beach', 'gallery'] , the default is bar ",
                    example: "restorant",
                  },
                  gateEntryfee: {
                      type: "string",
                      description: "Gate fee for entry in to the center",
                      example: "#20000"
                  },
                  bookingCategory: {
                      type: "string",
                      description: "The booking category available at the center which should be within the following option:['regular', 'vip', 'vvip'] ",
                      example: "vip"
                  },
                  images: {
                      type: "file",
                      description: "3 images of the center must be uploaded on registration "
                  }
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
                example: HangoutCenterResponseList[0]
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
                  example: HangoutCenterResponseList[1]
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
                  example: HangoutCenterResponseList[2]
                },
              },
            },
          },
      },
}

const getAllHangoutCenters = {
    tags: ["HangoutCenter"],
    description: "Get all available hangoutCenters",
    requestBody: {
        content: {
            "multipart/form-data": {
                schema: {
                    type: "object",
                    properties: {
                        // name: {
                        //     type: "string",
                        //     description:
                        //         "Full name of the center, minimum word lenght is: 3, ",
                        //     example: "Radison",
                        // },
                    }
                }
            }
        }
    },
    responses: {
        200: {
          description: "Ok",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: HangoutCenterResponseList[3]
              },
            },
          },
        },
        
      },
}

const getHangoutCenterByName = {
    tags: ["HangoutCenter"],
    description: "Search a center by name",
    requestBody: {
        content: {
            "multipart/form-data": {
                schema: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description:
                                "Full name of the center, minimum word lenght is: 3, ",
                            example: "ifitenes",
                        },
                    }
                }
            }
        }
    },
    responses: {
        200: {
          description: "Ok",
          content: {
            "application/json": {
              schema: {
                type: "object",
                example: HangoutCenterResponseList[4]
              },
            },
          },
        },
        417: {
            description: "Expectation Failed",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  example: HangoutCenterResponseList[5]
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
                  example: HangoutCenterResponseList[6]
                },
              },
            },
          },
      },
}
const hangoutCenterRouteDoc = {
    "/api/hangoutcenter/register": {
        post:hangoutCenterRegistration
    },
    "/api/hangoutcenter/getAll": {
        post: getAllHangoutCenters
    },
    "/api/hangoutcenter/getHangoutCenterByName": {
        post: getHangoutCenterByName
    }
}

module.exports= {hangoutCenterRouteDoc}