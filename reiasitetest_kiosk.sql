-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 27, 2024 at 09:54 AM
-- Server version: 8.0.36
-- PHP Version: 8.1.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `reiasitetest_kiosk`
--
CREATE DATABASE IF NOT EXISTS `reiasitetest_kiosk` DEFAULT CHARACTER SET latin1 COLLATE latin1_swedish_ci;
USE `reiasitetest_kiosk`;

-- --------------------------------------------------------

--
-- Table structure for table `kiosk_attendee_events`
--

CREATE TABLE `kiosk_attendee_events` (
  `kiosk_attendee_events_id` int NOT NULL,
  `kiosk_attendee_events_event_id` varchar(255) DEFAULT NULL,
  `kiosk_attendee_events_attendee_fname` varchar(255) DEFAULT NULL,
  `kiosk_attendee_events_checkin` varchar(255) DEFAULT NULL,
  `kiosk_attendee_events_attendee_email` varchar(255) DEFAULT NULL,
  `kiosk_attendee_events_attendee_phone` varchar(255) DEFAULT NULL,
  `kiosk_attendee_events_event_ifs_id` varchar(255) DEFAULT NULL,
  `kiosk_attendee_events_owner` varchar(255) DEFAULT '12345678',
  `kiosk_attendee_events_attendee_lname` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `kiosk_events`
--

CREATE TABLE `kiosk_events` (
  `kiosk_event_id` int NOT NULL,
  `kiosk_event_name` varchar(255) DEFAULT NULL,
  `kiosk_event_tag` varchar(255) DEFAULT '0',
  `kiosk_event_owner_id` varchar(255) DEFAULT NULL,
  `kiosk_event_location` varchar(255) DEFAULT NULL,
  `kiosk_event_timestamp` varchar(255) DEFAULT NULL,
  `kiosk_event_timestring` varchar(255) DEFAULT NULL,
  `kiosk_event_attendees` varchar(255) DEFAULT '0',
  `kiosk_event_status` varchar(1) DEFAULT '0',
  `kiosk_event_print` varchar(1) DEFAULT '1',
  `kiosk_event_logo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `kiosk_hosts`
--

CREATE TABLE `kiosk_hosts` (
  `kiosk_id` int NOT NULL,
  `kiosk_email` varchar(255) NOT NULL,
  `kiosk_pin` varchar(8) DEFAULT '00000000',
  `kiosk_password` varchar(255) NOT NULL,
  `kiosk_comapny_name` varchar(255) DEFAULT 'My Company Name',
  `kiosk_logo` varchar(255) DEFAULT 'default.png',
  `kiosk_contact_number` varchar(13) DEFAULT '000-000-0000',
  `kiosk_terminals` int DEFAULT '3',
  `kiosk_use_ifs` int DEFAULT '0',
  `kiosk_secret` varchar(255) DEFAULT NULL,
  `kiosk_secret_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `kiosk_logos`
--

CREATE TABLE `kiosk_logos` (
  `kiosk_logos_id` int NOT NULL,
  `kiosk_logos_logo` varchar(255) DEFAULT NULL,
  `kiosk_logos_name` varchar(255) DEFAULT NULL,
  `kiosk_logos_owner` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `kiosk_offline_members`
--

CREATE TABLE `kiosk_offline_members` (
  `kiosk_offline_member_id` int NOT NULL,
  `kiosk_offline_member_fname` varchar(255) DEFAULT NULL,
  `kiosk_offline_member_lname` varchar(255) DEFAULT NULL,
  `kiosk_offline_member_phone` varchar(255) DEFAULT NULL,
  `kiosk_offline_member_email` varchar(255) DEFAULT NULL,
  `ifs_id` varchar(255) DEFAULT NULL,
  `events_owner` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `kiosk_tags`
--

CREATE TABLE `kiosk_tags` (
  `kiosk_tag_id` int NOT NULL,
  `kiosk_tag_name` varchar(255) DEFAULT NULL,
  `kiosk_tag_tag` varchar(255) DEFAULT NULL,
  `kiosk_tag_owner` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `kiosk_attendee_events`
--
ALTER TABLE `kiosk_attendee_events`
  ADD PRIMARY KEY (`kiosk_attendee_events_id`);

--
-- Indexes for table `kiosk_events`
--
ALTER TABLE `kiosk_events`
  ADD PRIMARY KEY (`kiosk_event_id`);

--
-- Indexes for table `kiosk_hosts`
--
ALTER TABLE `kiosk_hosts`
  ADD PRIMARY KEY (`kiosk_id`),
  ADD UNIQUE KEY `kiosk_email_2` (`kiosk_email`);

--
-- Indexes for table `kiosk_logos`
--
ALTER TABLE `kiosk_logos`
  ADD PRIMARY KEY (`kiosk_logos_id`);

--
-- Indexes for table `kiosk_offline_members`
--
ALTER TABLE `kiosk_offline_members`
  ADD PRIMARY KEY (`kiosk_offline_member_id`);

--
-- Indexes for table `kiosk_tags`
--
ALTER TABLE `kiosk_tags`
  ADD PRIMARY KEY (`kiosk_tag_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `kiosk_attendee_events`
--
ALTER TABLE `kiosk_attendee_events`
  MODIFY `kiosk_attendee_events_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kiosk_events`
--
ALTER TABLE `kiosk_events`
  MODIFY `kiosk_event_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kiosk_hosts`
--
ALTER TABLE `kiosk_hosts`
  MODIFY `kiosk_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kiosk_logos`
--
ALTER TABLE `kiosk_logos`
  MODIFY `kiosk_logos_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kiosk_offline_members`
--
ALTER TABLE `kiosk_offline_members`
  MODIFY `kiosk_offline_member_id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kiosk_tags`
--
ALTER TABLE `kiosk_tags`
  MODIFY `kiosk_tag_id` int NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
