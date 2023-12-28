const searchModule = require('./../../modules/search');

const search = async (req, res) => {
  const { search, pageSize, page, facets, sortBy } = req.body;

  try {
    const payload = {
      page: Number(page) || 0,
      pageSize: Number(pageSize) || 10,
      search,
      facets,
      sortBy 
    };

    const result = await searchModule.search(payload);
    return res.status(200).json(result);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ msg: 'Something went wrong' });
  }
};

module.exports = {
  search
}