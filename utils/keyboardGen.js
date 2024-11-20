const inlineKeyboardGenerator = (keys, col, fn) => {
  const keyboard = [];
  for (let i = 0; i < keys.length; i += col) {
    const row = keys.slice(i, i + col).map((key) => fn(key));
    keyboard.push(row);
  }

  return keyboard;
};

module.exports = { inlineKeyboardGenerator };
