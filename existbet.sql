-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 30, 2018 at 01:05 PM
-- Server version: 5.7.14
-- PHP Version: 7.0.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `existbet`
--

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` char(36) COLLATE utf8_bin NOT NULL,
  `full_name` varchar(150) COLLATE utf8_bin DEFAULT NULL,
  `user_name` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `user_password` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `user_contact` varchar(50) COLLATE utf8_bin DEFAULT NULL,
  `user_email` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `user_status` char(15) COLLATE utf8_bin DEFAULT 'Active'
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `full_name`, `user_name`, `user_password`, `user_contact`, `user_email`, `user_status`) VALUES
('07378168-4498-ec38-6a28-c4a8d6e81228', 'dsadsd', 'd@gmail.com', '123456', '', 'd@gmail.com', 'Active');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
