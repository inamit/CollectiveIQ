import config from '../../config.json';

const signupUrl: string = config.signupUrl;

export async function SignUserUp(username: string, email: string, password: string) {
  try{
    let res = await fetch(config.backendURL + signupUrl, {
      method: "POST",
      body: JSON.stringify({
        username,
        email,
        password
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8"
      }
    });
    
    return res;
  } catch (error) {
    console.error("Error during signup:", error);
    throw error;
  }
}