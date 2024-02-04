export const test = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      message: 'Api is working !!!',
    },
  });
};
