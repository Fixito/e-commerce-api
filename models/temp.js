const agg = [
  {
    $match: {
      product: new ObjectId('64ba8435eec0fd0b272c4c4d')
    }
  },
  {
    $group: {
      _id: null,
      averageRating: {
        $avg: '$rating'
      },
      numOfReviews: {
        $sum: 1
      }
    }
  }
];
