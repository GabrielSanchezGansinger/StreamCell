//Taken from https://stackoverflow.com/questions/3231459/how-can-i-create-unique-ids-with-javascript

export default function uid() {
    return Date.now().toString(36) + 
        Math.random().toString(36).substring(2, 12).padStart(12, "0");
}