export function checkMissingKeys(array) {
  if (array) {
    let missing = [];

    const start = array[array.length - 1]["id"];

    for (let i = start; i < array[0]["id]"]; i++) {
      // find any ID's which are not incrementing by 1
      if (array[i]["id"] - array[i - 1]["id"] !== 1) {
        // diff will always iterate down -> 3 before are missing etc...
        const diff = array[i]["id"] - array[i - 1]["id"];
        missing.push({ id: array[i]["id"], diff });
      }
    }
    return missing;
  }
  return false;
}

export default {
  checkMissingKeys
};
