export const API_URL = import.meta.env.PROD
  ?'https://taskure-api.onrender.com/api'
  :'http://localhost:1337/api';


export const API_TOKEN = import.meta.env.PROD
    ? 'caddd05ad9f921da21b7a2d5edfd222edb646f5287d393cd64e3cdf9980fdfd2f2fcc3c7801a11ecdd8eb4ffd61a4c8b871a318b7f58229adbc59b09a6e4fdc5cedf156ce9e35bcc8e6b710a923fb9e097f5d6fdaf1fcfc9330bd9d0d38ad5caaabc80c94a1a1aa7d3e5658903adb9dcfe1e0e9b94faf7f8d9482eafc4833155'
    : '807a0179ab29a620c59bdc8ea90949ccd57077ca174ff6b6e984272b02430fb17a554e21fd6ac48451a230b27c14f7794024af2cc4559255da3920efe029fda21c3fa1d1bf793f11b989e85a911f3afa3fb78f3304ed472239cdd9ba36d4865c2b3e428a9cc55c04dd99264c878a1a30ad9255f1a65556f2e73b55679172fc08';


