// These Functions were generated with ChatGPT version 3.5
// Prompts given by Gabriel Sánchez Gänsinger on the 19/01/2024

export function decimalToBase26(decimalNumber: number): string {
	if (decimalNumber < 0) {
	  throw new Error("Input must be a non-negative integer");
	}
  
	let result = "";
	while (decimalNumber > 0) {
	  const remainder = (decimalNumber - 1) % 26;
	  result = String.fromCharCode(remainder + 65) + result;
	  decimalNumber = Math.floor((decimalNumber - 1) / 26);
	}
  
	return result || "A";
  }
  
export function base26ToDecimal(base26String: string): number {
	let decimalNumber = 0;
	const base = 26;
  
	for (let i = 0; i < base26String.length; i++) {
	  const charCode = base26String.charCodeAt(i) - 65;
	  const power = base26String.length - 1 - i;
	  decimalNumber += ((charCode + 1) * Math.pow(base, power));
	}
  
	return decimalNumber;
  }

export  function increment(string: string): string {
	return decimalToBase26(base26ToDecimal(string) + 1);
}