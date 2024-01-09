export const test = (req, res) => {
  res.status(200).json({
    status: 'Success',
    data: {
      message: 'Api is working !!!',
    },
  });
};
