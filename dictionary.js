const axios = require("axios");
const { DEF_LANGS } = require("./config");

/**
 * Extracts useful data from API response.
 * @param {Object} jsonData - The JSON data from the API response.
 * @returns {Array} List of dictionary data.
 */
function parseJson(jsonData) {
  const contents = [];
  const defs = jsonData.d.Definitions;

  const removeHtmlTags = (str) => str.replace(/<[^>]*>/g, "");

  defs.forEach((definition) => {
    definition.WordTypeDefinitions.forEach((typeDef) => {
      const entry = {
        WordType: typeDef.WordType,
        defs: [],
        Language: definition.Language,
      };

      typeDef.DefinitionContents.forEach((content) => {
        entry.defs.push(removeHtmlTags(content.Content));
      });

      contents.push(entry);
    });
  });

  return contents;
}

/**
 * Fetches dictionary data for a given word.
 * @param {string} word - The word to look up.
 * @returns {Promise<Array>} Parsed dictionary data.
 */
async function fetchWord(word, lang = "English") {
  const data = {
    word,
    fromLanguage: lang,
    toLanguage: "Amharic",
  };

  try {
    const response = await axios.post(process.env.API_BASE_URL, data, {
      headers: { "Content-Type": "application/json" },
    });

    return parseJson(response.data);
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

module.exports = { fetchWord };
