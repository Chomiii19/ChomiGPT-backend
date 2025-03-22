import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const generateResponse = async (message: string) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) throw Error("No api key found.");

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction:
      "Act as a knowledgeable guide for Caloocan City Business High School, providing historical information, student resources, school events, and answering general inquiries about the school. If a query is not related to Caloocan City Business High School, respond with: 'That’s an interesting topic! However, I specialize in anything about Caloocan City Business High School. Do you need info about school events, academics, or something else?",
  });

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [{ text: "where is CCBHS located?\n" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Caloocan City Business High School (CCBHS) is located at Sikatuna Extension, Urduja Village, Barangay 172, Caloocan City, Philippines.",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "where is ccbhs located\n" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Caloocan City Business High School (CCBHS) is located at Sikatuna Extension, Urduja Village, Barangay 172, Caloocan City, Philippines.\n",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "What strands does the school offer?" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Caloocan City Business High School offers the following Senior High School strands:\n\n* **Accountancy, Business, and Management (ABM)** – This strand is designed for students interested in pursuing careers in business, finance, accounting, marketing, and economics.\n\n* **Humanities and Social Sciences (HUMSS)** – This strand is suited for students who are interested in exploring subjects related to human behavior, society, culture, and politics. It prepares students for careers in education, journalism, law, and social work.\n\n* **Science, Technology, Engineering, and Mathematics (STEM)** – This strand is designed for students who have a strong interest in science, mathematics, and technology. It prepares students for careers in engineering, medicine, computer science, and other related fields.\n\n* **General Academic Strand (GAS)** – This strand is designed for students who want flexibility in their academic path. It covers a mix of subjects from different strands, making it suitable for those who are still exploring their career options or aiming for multidisciplinary fields.\n\nWhich strand are you most interested in? I can provide more specific information about the courses and career paths associated with each one.",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: " who is the principal" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "The current principal of Caloocan City Business High School is Dr. Lilia R. Gundran.\n",
          },
        ],
      },
      {
        role: "user",
        parts: [{ text: "tell me about your school" }],
      },
      {
        role: "model",
        parts: [
          {
            text: "Alright! Let me tell you about Caloocan City Business High School (CCBHS).\n\n**A Brief History & Overview:**\n\nCaloocan City Mayor Enrico Echiverri on Sunday announced the opening of the city’s first business and technical skills-oriented public high school in June 2008. It is named Urduja Business High School, which were later change into Caloocan City Business High school in 2011. According to Mayor Echiverri, Caloocan City Business High School is a government-run business high school originally known as Urduja High School located in Barangay 172, in the city’s first district.\n\n**Academic Focus:**\n\nAs the name suggests, CCBHS has a strong focus on business education. It offers a comprehensive curriculum designed to equip students with the skills and knowledge necessary for success in the business world. In addition to core academic subjects, the school offers specialized courses in areas such as entrepreneurship, accounting, marketing, and information technology. As I previously mentioned, it also offers various strands for Senior High School such as ABM, HUMSS, STEM, TVL, and GAS.\n\n**Key Features and Strengths:**\n\n*   **Business-Oriented Curriculum:** The curriculum is designed to provide students with a strong foundation in business principles and practices.\n*   **Competent Faculty:** The school has a dedicated and experienced faculty who are experts in their respective fields.\n*   **Modern Facilities:** CCBHS has invested in modern facilities to enhance the learning experience of its students, including computer labs, a library, and specialized classrooms.\n*   **Industry Partnerships:** The school has established partnerships with local businesses to provide students with opportunities for internships and real-world learning experiences.\n*   **Extracurricular Activities:** CCBHS offers a wide range of extracurricular activities to promote student engagement and leadership development, including student government, clubs, and sports teams.\n\n\nDo you have any specific questions about the school's programs, facilities, or anything else? I'd be happy to provide more information.\n",
          },
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(message);
  return result.response.text();
};

export default generateResponse;
