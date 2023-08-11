# Create a new user account
CREATE USER 'mehvi'@'localhost' IDENTIFIED BY 'water@123';

# Create a new database
CREATE DATABASE mehvi_lady;

# Grant the user access to the database
GRANT ALL PRIVILEGES ON mehvi_lady.* TO 'mehvi'@'localhost';

use mehvi_lady;