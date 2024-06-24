import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const sendClaude = async (req, res) => {
  const message = await anthropic.messages.create({
    max_tokens: 1024,
    messages: [{ role: "user", content: req.body.message }],
    model: "claude-3-5-sonnet-20240620",
  });

  console.log(message.content);

  return res.status(200).json({
    message: message.content[0].text,
  });
};

const sendClaudeStream = async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader('Connection', 'keep-alive');

  const stream = anthropic.messages
    .stream({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: "Hola!",
        },
      ],
    })
    .on("text", (text) => {
      console.log(text);
    });

  const message = await stream.finalMessage();
  console.log(message);
  const messageFinal = message.content[0].text;

  res.write(`data: ${messageFinal}\n\n`);
  res.end();
};

export { sendClaude, sendClaudeStream };
