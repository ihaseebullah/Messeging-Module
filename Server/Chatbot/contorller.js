const { wellness } = require("./data");

async function ai(req, res) {
    const { prompt, history } = req.body;
    try {
        const genAI = new GoogleGenerativeAI(process.env.API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const chat = model.startChat({

            history: [
                {
                    role: "user",
                    parts: [
                        {
                            text: "You are going to act as an assistant in my app.And your name for the time being is Eleven Assistant if someone ask you.Here are furtur details the user may ask " + wellness
                        }
                    ]
                },
                {
                    role: "model",
                    parts: [
                        {
                            text: "Response message here"
                        }
                    ]
                }
            ],
            generationConfig: {
                maxOutputTokens: 100,
            },
        });
        const result = await chat.sendMessage(prompt);
        res.status(200).json({ output: result.response.text() })
    } catch (e) {
        console.log(e)
        res.status(500).json({ output: "Internal Server Error", message: e.message })
    }
}

module.exports = ai;