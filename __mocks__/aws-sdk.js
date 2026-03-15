const mockUpload = jest.fn().mockReturnValue({
  promise: jest.fn().mockResolvedValue({
    Key: 'uploads/test-image.jpg',
    Location: 'http://localhost:9000/learning-uploads/uploads/test-image.jpg',
  }),
});

const mockS3Instance = {
  upload: mockUpload,
};

class S3 {
  constructor() {
    return mockS3Instance;
  }
}

module.exports = { S3, mockUpload, mockS3Instance };
