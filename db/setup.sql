DROP DATABASE IF EXISTS nc_messenger_testt;
DROP DATABASE IF EXISTS nc_messenger;

CREATE DATABASE nc_messenger_test;
CREATE DATABASE nc_messenger;


-- CREATE TABLE endpoints
-- (
--   endpointID SERIAL PRIMARY KEY NOT NULL,
--   endpoint AS JSON_VALUE(jsonContent, '$."GET /api"'),
-- );

-- SELECT *
-- FROM endpoints;