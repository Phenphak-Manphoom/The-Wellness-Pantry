class APIFilters {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    if (this.queryStr.keyword) {
      const keyword = {
        name: { $regex: this.queryStr.keyword, $options: "i" },
      };
      this.query = this.query.find({ ...keyword });
    }
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    ["keyword", "page"].forEach((field) => delete queryCopy[field]);

    console.log("✅ Received query parameters:", this.queryStr);

    // กำหนดตัวแปรสำหรับ filter
    const filterConditions = {};

    // ✅ ใช้ Object.entries() เพื่อลดโค้ดซ้ำซ้อน
    Object.entries(queryCopy).forEach(([key, value]) => {
      if (value != null) {
        console.log(`✅ Filtering by ${key}:`, value);
      }
    });

    // ✅ กรองตาม size + price
    const size = this.queryStr.size;
    const min = Number(this.queryStr["prices.price"]?.gte);
    const max = Number(this.queryStr["prices.price"]?.lte);

    if (size && !isNaN(min) && !isNaN(max)) {
      console.log(
        `🛒 Filtering by size: ${size}, price >= ${min}, price <= ${max}`
      );

      filterConditions.prices = {
        $elemMatch: {
          size,
          price: { $gte: min, $lte: max },
        },
      };
    }

    // ✅ กรองตาม category
    if (this.queryStr.category) {
      filterConditions.category = this.queryStr.category;
    }

    // ✅ กรองตาม rating
    if (this.queryStr.ratings) {
      filterConditions.ratings = { $gte: Number(this.queryStr.ratings) };
    }

    console.log("🔍 Final Filters:", JSON.stringify(filterConditions, null, 2));

    this.query = this.query.find(filterConditions);
    return this;
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

export default APIFilters;
