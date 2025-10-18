CREATE TABLE admin (
    id SERIAL ,
    email VARCHAR(225) UNIQUE NOT NULL ,
    password_hash VARCHAR(255) NOT NULL ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blogs (
    id SERIAL ,
    title VARCHAR(225) NOT NULL,
    content TEXT NOT NULL ,
    slug VARCHAR(225) UNIQUE NOT NULL,
    like_count INTEGER DEFAULT 0 ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE blog_likes (
    id SERIAL , 
    blog_id INTEGER REFERENCES blogs(id) ON DELETE CASCADE,
    user_id VARCHAR(225) NOT NULL , --we will use Ip base address here 
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(blog_id , user_id)
)