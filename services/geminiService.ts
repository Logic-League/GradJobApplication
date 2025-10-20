import { GoogleGenAI, Type, Modality } from "@google/genai";
import { JobListing, JobSearchQuery, PromptHistoryItem, PromptType, CareerAvailability } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        jobTitle: { type: Type.STRING, description: "The title of the job position, e.g., 'Junior Software Engineer'." },
        company: { type: Type.STRING, description: "The name of the company hiring." },
        location: { type: Type.STRING, description: "The city and country where the job is located, e.g., 'Cape Town, South Africa'." },
        description: { type: Type.STRING, description: "A brief, one or two-sentence summary of the job role." },
        url: { type: Type.STRING, description: "A plausible, but placeholder, URL to the full job posting." },
        source: {
          type: Type.OBJECT,
          description: "A review of the platform or source where the job was found.",
          properties: {
            name: { type: Type.STRING, description: "The name of the job source, e.g., 'LinkedIn', 'Indeed', 'Company Careers Page'." },
            rating: { type: Type.NUMBER, description: "A rating of the source's reliability for new graduates, from 1 (poor) to 5 (excellent)." },
            summary: { type: Type.STRING, description: "A short summary explaining the rating and what to expect from this source." }
          },
          required: ["name", "rating", "summary"]
        }
      },
      required: ["jobTitle", "company", "location", "description", "url", "source"]
    }
};

const savePromptToHistory = (
    username: string,
    type: PromptType,
    prompt: string,
    query: any
) => {
    const historyKey = `promptHistory_${username}`;
    try {
        const history: PromptHistoryItem[] = JSON.parse(localStorage.getItem(historyKey) || '[]');
        const newEntry: PromptHistoryItem = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            type,
            prompt,
            query,
        };
        history.unshift(newEntry); // Add new prompts to the top
        localStorage.setItem(historyKey, JSON.stringify(history));
    } catch (error) {
        console.error("Failed to save prompt to history:", error);
    }
};


export const findJobs = async (query: JobSearchQuery, username: string | null): Promise<JobListing[]> => {
    const prompt = `
        You are an AI career assistant for new graduates. Your task is to find and list entry-level job opportunities based on a user's request.

        User Request:
        - Career Field: ${query.careerField}
        - Location: ${query.location}

        Based on this request, generate a list of 5 to 7 relevant job listings suitable for recent graduates.
        For each job, provide a plausible title, company, location, and a brief description.
        Crucially, for each listing, also provide a review of the job source (e.g., LinkedIn, Indeed, a specific company's career page). This review should include the source's name, a reliability rating from 1 to 5, and a brief summary explaining the rating.
        All generated URLs should be placeholder links, like 'https://example.com/apply/job-id'.
        Return the list in JSON format according to the provided schema.
    `;
    
    if (username) {
        savePromptToHistory(username, 'Job Search', prompt, query);
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
                temperature: 0.7,
            },
        });
        
        const jsonText = response.text.trim();
        const parsedData = JSON.parse(jsonText);

        if (!Array.isArray(parsedData)) {
            throw new Error("AI response is not in the expected array format.");
        }
        
        return parsedData as JobListing[];

    } catch (error) {
        console.error("Error calling Gemini API for jobs:", error);
        throw new Error("Could not retrieve jobs from AI service.");
    }
};

export const generateCareerImage = async (careerField: string, username: string | null): Promise<string> => {
    const prompt = `An abstract, professional, and inspiring digital art banner representing the career field of '${careerField}'. The style should be modern and minimalist, with a tech-oriented feel. Use a color palette centered around dark gray, vibrant lime green, and clean white accents. The image should be abstract and conceptual, not literal.`;

    if (username) {
        savePromptToHistory(username, 'Image Generation', prompt, { careerField });
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: prompt }] },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
        if (imagePart && imagePart.inlineData) {
            return imagePart.inlineData.data;
        } else {
            throw new Error("No image data returned from the AI service.");
        }
    } catch (error) {
        console.error("Error calling Gemini API for images:", error);
        throw new Error("Could not generate a career banner.");
    }
};

export const getCareerAvailability = async (careerField: string, username: string | null): Promise<CareerAvailability[]> => {
    const availabilitySchema = {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                country: { type: Type.STRING },
                availabilityScore: { type: Type.NUMBER, description: "A score from 1 (low availability) to 10 (high availability)." },
                summary: { type: Type.STRING, description: "A brief one-sentence summary explaining the score." }
            },
            required: ["country", "availabilityScore", "summary"]
        }
    };
    
    const prompt = `
        For the career field of '${careerField}', analyze the job market for new graduates in these specific countries: USA, China, Russia, India, UK, Dubai, and Brazil.

        Your task is to provide a rating for the job opportunity availability in each country on a scale of 1 to 10, where 1 represents very low availability and 10 represents very high availability.
        
        Also provide a concise, one-sentence summary explaining the reasoning behind each score.

        Return the data as a JSON array according to the provided schema.
    `;

    if (username) {
        savePromptToHistory(username, 'Career Availability', prompt, { careerField });
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: availabilitySchema,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as CareerAvailability[];
    } catch (error) {
        console.error("Error calling Gemini API for career availability:", error);
        throw new Error("Could not retrieve career availability data.");
    }
};


export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / 1; // numChannels = 1
  const buffer = ctx.createBuffer(1, frameCount, 24000); // sampleRate = 24000

  const channelData = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    channelData[i] = dataInt16[i] / 32768.0;
  }
  return buffer;
}


export const generateSummaryAndAudio = async (jobs: JobListing[], username: string | null): Promise<string> => {
    const summaryPrompt = `
        Concisely summarize the following job search results for a new graduate.
        Start by stating the total number of jobs found.
        Mention the main career field and location. Briefly mention the types of job sources that were found (e.g., "mostly on major job boards and some direct company sites").
        Keep the summary under 50 words and adopt a friendly, encouraging tone.

        List of Jobs Found:
        ${jobs.map(j => `- ${j.jobTitle} at ${j.company}`).join('\n')}
    `;
    
    const summaryResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: summaryPrompt,
    });
    const summaryText = summaryResponse.text;
    
    if (username) {
        savePromptToHistory(username, 'Audio Summary', `Say encouragingly: ${summaryText}`, { jobCount: jobs.length });
    }

    const ttsResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say encouragingly: ${summaryText}` }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });

    const base64Audio = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
        throw new Error("Failed to generate audio from the AI service.");
    }
    
    return base64Audio;
};

// FIX: Add decode function for base64 audio data as per guidelines.
export function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
