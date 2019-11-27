exports.formatDates = list => {
  // console.log(list);
  if (!list) return undefined;
  const newList = JSON.parse(JSON.stringify(list));
  newList.map(obj => {
    const date = new Date(obj.created_at);
    return (obj.created_at = date);
  });

  // const date = new Date(newList[0].created_at);
  // newList[0].created_at = date;
  // return newList;
  return newList;
};

exports.makeRefObj = list => {
  if (!list) return undefined;
  const ref = JSON.parse(JSON.stringify(list));
  const refObj = {};
  ref.map(obj => {
    return (refObj[obj.title] = obj.article_id);
  });
  return refObj;
};

exports.formatComments = (articleRef, comments) => {
  const commentsData = JSON.parse(JSON.stringify(comments));
  commentsData.map(obj => {
    const date = new Date(obj.created_at);
    obj.created_at = date;
    obj["author"] = obj.created_by;
    delete obj.created_by;
    const article = articleRef[obj.belongs_to];
    obj.article_id = article;
    delete obj.belongs_to;
    return obj;
  });
  // console.log(commentsData);
  // console.log(commentsData);
  return commentsData;
};
