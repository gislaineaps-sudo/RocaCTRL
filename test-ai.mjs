import { submitGeneralChat } from './src/ai/flows/general-chat.js';

async function main() {
  try {
    const response = await submitGeneralChat('Olá, como posso cultivar tomates?');
    console.log('Response:', response);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

main();
