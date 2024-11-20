const findUser = async function (userId) {
  return await this.findOne({ userId });
};

module.exports = {
  findUser,
};
