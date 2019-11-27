DROP DATABASE IF EXISTS nc_news_test;
DROP DATABASE IF EXISTS nc_news;

CREATE DATABASE nc_news_test;
CREATE DATABASE nc_news;


-- CREATE TABLE endpoints
-- (
--   endpointID SERIAL PRIMARY KEY NOT NULL,
--   endpoint AS JSON_VALUE(jsonContent, '$."GET /api"'),
-- );

-- SELECT *
-- FROM endpoints;