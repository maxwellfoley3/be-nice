import axios from 'axios';
import { AppError } from '../middleware/errorHandler';
/*
curl -X POST \
     -H "Authorization: Bearer ya29.a0AeXRPp5YOFUgHZSe7L9e3-_XZdgEFfKGsm0S6kbjSs1beOBt8Q319pbRW28GpXZo_8PiXx-kwfkxuRSRRjmjVZfXBQATMHOCXE4Z1cCakNXBOP4hzC86ESvJi8Pr3VcpJf1gg_sUW5pmoh9DOSzT0Iw16fSkOWcOYJsfYA_7oZ29fxR9RuuNUTOJyo3FRVVM4Sg-BjMb4MLirfBXIXKf8Y-c4VZshW8ZqotI_7QasSG1A5qoa8m27dEZUGOu6hHYhJLU5jSgpHBFpgmyJGPtnYqY2-6wB--H5hmPibNF9igB4opdK2FGdqvhopLMC4ynaJeAMqy06ubsziXig8YVuzF0mf9qzcFDz17JCMdtoewvmJzLD2G3Acq78R0pTIoGQiZiD5mlMpaerTfWiGzJKn8IGBSkIuShxQaCgYKAYUSARISFQHGX2MiCiFAxYuFrVpCCzyVXI3-Og0425" \
     -H "x-goog-user-project: protean-cistern-452120-u5" \
     -H "Content-Type: application/json; charset=utf-8" \
     --data "{
  'encodingType': 'UTF8',
  'document': {
    'type': 'PLAIN_TEXT',
    'content': 'Enjoy your vacation!'
  }
}" "https://language.googleapis.com/v2/documents:analyzeSentiment"
*/
const HUGGING_FACE_URL = process.env.HUGGING_FACE_URL || '';
export const analyzeSentiment = async (text: string) => {
  const response = await axios.post(    
    HUGGING_FACE_URL,
    {
      inputs: text
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    }
  ).catch((err) => {
    if (err.response.status === 503) {
      throw new AppError('Sentiment analysis service is currently unavailable', 503);
    }
    throw err;
  });
  return response.data;
};
