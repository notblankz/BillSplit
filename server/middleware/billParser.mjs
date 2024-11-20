import { ocrSpace } from "ocr-space-api-wrapper";
import { Mistral } from "@mistralai/mistralai";
import dotenv from 'dotenv'

// dotenv shenanigans
dotenv.config()

// Gemini Shenanigans
const client = new Mistral({apiKey: process.env.MISTRAL_API_KEY});

export async function createJSON(req, res) {
    try {
        console.log(`Bill: ${req.body.billName} received for parsing`)
        // Extract the text using OCR
        const extractedText = await extractText(req.file.buffer.toString("base64"));
        console.log(extractedText)
        console.log("\n")

        const prompt = `
  Given the extracted text from a bill Image below (so they might contain astray characters so try to normalise stuff), generate a json file with the following structure:

  ignore any negative values present in the bill and dont put it in the json file.

  Anything within the parantheses brackets must be stricly followed while generating the json file.

  (Give the response in plain text and without any wrapper text)
  Fill in values that are not available or that seem wrong by analysing the entire bill and the structure of the bill. You can calculate the values
  from the grand total and other parameters present in the bill.

  (STRICTLY FOLLOW THE JSON FORMAT AT ANY COSTS)

  {
    "items": [
    {
      itemName: <Item Name> (if the item name is split into multiple lines, join them with a space)
      price: <Rate per item> (check from the bill structure whether its the total rate or rate per item),
      quantity: <Quantity> (if quantity is not present find the quantity by dividing the total amount by the price),
      total: <Amount> (check from the bill structure whether its the total amount or amount per item)
    },
    {
      itemName: <Item Name>,
      price: <Rate per item>,
      quantity: <Quantity>,
      total: <Amount>
    }
    ],
    "tax": {
    "CGST 2.5%": <CGST> (if CGST is not present calculate and put it in the JSON file),
    "SGST 2.5%": <SGST> (if SGST is not present calculate and put it in the JSON file),
    },
    "serviceCharge": <Service Charge> (if service charge is not present put the value as 0 in the json file),
    "grandTotal": <Grand Total> (<Grand Total> should be equal to the sum of all the items and taxes)
  }

  Example JSON:
    {
        "items": [
        {
        itemName: "Item 1",
        price: "100",
        quantity: "2",
        total: "200"
        },
        {
        itemName: "Item 2",
        price: "50",
        quantity: "1",
        total: "50"
        }
        ],
        "tax": {
        "CGST": "10",
        "SGST": "10"
        },
        "grandTotal": "260"
    }

    The extracted text from the bill image is given below:
  ${extractedText}
  `;


        // Send the prompt to Mistral
        const result = await client.chat.complete({
            model: "open-mistral-nemo",
            messages: [{
                role : "system",
                content: prompt
            }]
        })
        const billJSON = JSON.parse(result.choices[0].message.content);
        console.log(`Bill details generated for ${req.body.billName}`)
        billJSON.billName = req.body.billName;
        console.log(billJSON)

        res.status(200).send(billJSON);

    } catch(error) {
        console.log(error)
        res.status(500).send("Error in generating bill JSON");
    }
}


// async function extractText(base64String) {
//     try {
//         const ocrResponse = await ocrSpace(`data:image/jpeg;base64,${base64String}`,{
//             apiKey: process.env.OCR_API_KEY,
//             scale: true,
//             isTable: true,
//             OCREngine: 2
//         });
//         const extractedText = ocrResponse.ParsedResults.map(({ ParsedText }) => ParsedText)
//         console.log("Text extracted")
//         return extractedText[0];
//     } catch (error) {
//         console.log(error)
//     }
// }

async function extractText(base64String) {
    try {
        const messages = [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: "Transribe the text from the bill image"
                    },
                    {
                        type: "image_url",
                        imageUrl: `data:image/jpeg;base64,${base64String}`
                    }
                ]
            }
        ]

        const response = await client.chat.complete({
            model: "pixtral-12b",
            messages: messages
        });

        const extractedText = response.choices[0].message.content;

        return extractedText;

    } catch (e) {
        console.log("Error Extracting Text");
        throw e;
    }
}
