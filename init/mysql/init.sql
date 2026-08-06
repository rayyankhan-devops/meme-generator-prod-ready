-- MySQL Database Initialization Script for Meme Generator

CREATE TABLE IF NOT EXISTS `memes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `image_url` TEXT NOT NULL,
  `caption` VARCHAR(255) DEFAULT '',
  `category` VARCHAR(50) DEFAULT 'general',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed predefined memes into the database
INSERT INTO `memes` (`title`, `image_url`, `caption`, `category`) VALUES
('It Works on My Machine', 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80', 'Then we will ship your machine to the customer!', 'developer'),
('CSS Alignment Stress', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80', 'Just display: flex; justify-content: center; align-items: center;', 'frontend'),
('Deploying to Production on Friday', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80', 'What could possibly go wrong at 4:59 PM?', 'devops'),
('Reading Legacy Code', 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=800&q=80', 'Who wrote this monstrosity... oh wait, git blame says me 6 months ago.', 'coding'),
('Bug Fixed, 10 New Bugs Born', 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80', '99 little bugs in the code, take one down, patch it around... 127 bugs in the code.', 'debugging'),
('Senior Dev Watching Junior Dev', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80', 'Grabs popcorn while watching `rm -rf /` in staging environment.', 'humor');
