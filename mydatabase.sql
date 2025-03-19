-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: mysql:3306
-- Generation Time: Mar 19, 2025 at 03:55 AM
-- Server version: 9.2.0
-- PHP Version: 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mydatabase`
--

-- --------------------------------------------------------

--
-- Table structure for table `approval_statuses`
--

CREATE TABLE `approval_statuses` (
  `id` bigint UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `name` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `approval_statuses`
--

INSERT INTO `approval_statuses` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`) VALUES
(1, '2025-03-16 05:41:48.000', '2025-03-16 05:41:51.000', NULL, 'อนุมัติ'),
(2, '2025-03-16 05:41:53.000', '2025-03-16 05:41:54.000', NULL, 'ไม่อนุมัติ'),
(3, '2025-03-16 05:41:58.000', '2025-03-16 05:41:56.000', NULL, 'รอนำเนินการ');

-- --------------------------------------------------------

--
-- Table structure for table `borrow_lists`
--

CREATE TABLE `borrow_lists` (
  `id` bigint UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `date_borrow` date NOT NULL,
  `date_return` date DEFAULT NULL,
  `doc_borrow` varchar(255) DEFAULT NULL,
  `doc_return` varchar(255) DEFAULT NULL,
  `approval_status_borrow_id` bigint UNSIGNED DEFAULT NULL,
  `approval_status_return_id` bigint UNSIGNED DEFAULT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `borrow_list_details`
--

CREATE TABLE `borrow_list_details` (
  `id` bigint UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `borrow_list_id` bigint UNSIGNED DEFAULT NULL,
  `equipment_id` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `branches`
--

CREATE TABLE `branches` (
  `id` bigint UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `name` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `branches`
--

INSERT INTO `branches` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`) VALUES
(1, '2025-03-14 16:01:17.701', '2025-03-14 16:01:17.701', NULL, 'คณะ'),
(2, '2025-03-15 19:54:57.029', '2025-03-15 19:54:57.029', NULL, 'วิทยาการคอมพิวเตอร์');

-- --------------------------------------------------------

--
-- Table structure for table `budget_sources`
--

CREATE TABLE `budget_sources` (
  `id` bigint UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `name` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `budget_sources`
--

INSERT INTO `budget_sources` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`) VALUES
(1, '2025-03-15 20:09:53.150', '2025-03-15 20:09:53.150', NULL, 'เงินงบประมาณ แผ่นดิน'),
(2, '2025-03-15 20:10:04.470', '2025-03-15 20:10:04.470', NULL, 'เงินรายได้ (งบนโยบายต่อเนื่อง)');

-- --------------------------------------------------------

--
-- Table structure for table `equipment`
--

CREATE TABLE `equipment` (
  `id` bigint UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `code` varchar(191) NOT NULL,
  `value` varchar(10) NOT NULL,
  `date_come` date DEFAULT NULL,
  `feature` varchar(150) DEFAULT NULL,
  `location` varchar(150) DEFAULT NULL,
  `code_old` varchar(150) DEFAULT NULL,
  `equipment_status_id` bigint UNSIGNED DEFAULT NULL,
  `budget_source_id` bigint UNSIGNED DEFAULT NULL,
  `unit_id` bigint UNSIGNED DEFAULT NULL,
  `equipment_group_id` bigint UNSIGNED DEFAULT NULL,
  `equipment_name_id` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `equipment`
--

INSERT INTO `equipment` (`id`, `created_at`, `updated_at`, `deleted_at`, `code`, `value`, `date_come`, `feature`, `location`, `code_old`, `equipment_status_id`, `budget_source_id`, `unit_id`, `equipment_group_id`, `equipment_name_id`) VALUES
(1, '2025-03-15 22:42:31.433', '2025-03-15 22:42:31.433', NULL, '1', '1200000', '2025-03-16', 'xxxxxxxx', 'xxxxxxxx', 'xxxxxxxx', 1, 1, 3, 1, 1),
(7, '2025-03-15 22:44:41.351', '2025-03-15 22:44:41.351', NULL, '2', '25000', '2025-03-16', 'xxxxxxxx', 'xxxxxxxx', 'xxxxxxxx', 1, 1, 3, 1, 5),
(8, '2025-03-15 22:45:44.086', '2025-03-15 22:45:44.086', NULL, '3', '25000', '2025-03-16', 'xxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxx', 'xxxxxxxxxxxxxxx', 1, 1, 2, 2, 6);

-- --------------------------------------------------------

--
-- Table structure for table `equipment_brokens`
--

CREATE TABLE `equipment_brokens` (
  `id` bigint UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `date_broken` date DEFAULT NULL,
  `date_end_repair` date DEFAULT NULL,
  `detail` varchar(255) DEFAULT NULL,
  `equipment_id` bigint UNSIGNED DEFAULT NULL,
  `equipment_status_id` bigint UNSIGNED DEFAULT NULL,
  `user_id` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `equipment_groups`
--

CREATE TABLE `equipment_groups` (
  `id` bigint UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `code` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `equipment_groups`
--

INSERT INTO `equipment_groups` (`id`, `created_at`, `updated_at`, `deleted_at`, `code`, `name`) VALUES
(1, '2025-03-15 20:05:18.984', '2025-03-15 20:05:18.984', NULL, '201', 'ครุภัณฑ์สํานักงาน'),
(2, '2025-03-15 20:05:51.488', '2025-03-15 20:05:51.488', NULL, '202', 'ครุภัณฑ์การศึกษา'),
(3, '2025-03-15 20:06:09.690', '2025-03-15 20:06:09.690', NULL, '203', 'ครุภัณฑ์ยานพาหนะและขนส่ง'),
(4, '2025-03-15 20:06:26.695', '2025-03-15 20:06:26.695', NULL, '206', 'ครุภัณฑ์ไฟฟ้าและวิทยุ'),
(5, '2025-03-15 20:06:40.622', '2025-03-15 20:06:40.622', NULL, '207', ' ครุภัณฑ์โฆษณาและเผยแพร่'),
(6, '2025-03-15 20:07:00.760', '2025-03-15 20:07:00.760', NULL, '208', 'ครุภัณฑ์วิทยาศาสตร์และการแพทย์'),
(7, '2025-03-15 20:07:40.817', '2025-03-15 20:07:40.817', NULL, '209', 'ครุภัณฑ์งานบ้านงานครัว');

-- --------------------------------------------------------

--
-- Table structure for table `equipment_names`
--

CREATE TABLE `equipment_names` (
  `id` bigint UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `name` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `equipment_names`
--

INSERT INTO `equipment_names` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`) VALUES
(1, '2025-03-15 20:08:10.883', '2025-03-15 20:08:10.883', NULL, 'ลิฟท์โดยสาร'),
(2, '2025-03-15 20:08:16.216', '2025-03-15 20:08:16.216', NULL, 'เครื่องปรับอากาศ'),
(3, '2025-03-15 20:08:25.558', '2025-03-15 20:08:25.558', NULL, 'เครื่องพิมพ์คอมพิวเตอร์'),
(4, '2025-03-15 20:08:42.842', '2025-03-15 20:08:42.842', NULL, 'เก้าอี้สํานักงานเบาะหนังมีโช๊คปรับสูง-ตํ่า'),
(5, '2025-03-15 22:42:56.534', '2025-03-15 22:43:05.127', NULL, 'ป้ายชื่อศูนย์วิทยาศาสตร์'),
(6, '2025-03-15 22:45:18.663', '2025-03-15 22:45:18.663', NULL, 'เครื่องชั่งทศนิยม 2 ตําแหน่ง');

-- --------------------------------------------------------

--
-- Table structure for table `equipment_statuses`
--

CREATE TABLE `equipment_statuses` (
  `id` bigint UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `name` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `equipment_statuses`
--

INSERT INTO `equipment_statuses` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`) VALUES
(1, '2025-03-16 05:40:54.000', '2025-03-16 05:41:16.000', NULL, 'ว่าง'),
(2, '2025-03-16 05:40:59.000', '2025-03-16 05:41:18.000', NULL, 'ไม่ว่าง'),
(3, '2025-03-16 05:41:02.000', '2025-03-16 05:41:22.000', NULL, 'ชำรุด'),
(4, '2025-03-16 05:41:05.000', '2025-03-16 05:41:20.000', NULL, 'สูญหาย'),
(5, '2025-03-16 05:41:07.000', '2025-03-16 05:41:25.000', NULL, 'ซ่อมแซ่มสำเร็จ'),
(6, '2025-03-16 05:41:10.000', '2025-03-16 05:41:27.000', NULL, 'ไม่สามารถใช้งานได้'),
(7, '2025-03-16 05:41:12.000', '2025-03-16 05:41:23.000', NULL, 'รอดำเนินการการยืม'),
(8, '2025-03-16 05:41:14.000', '2025-03-16 05:41:29.000', NULL, 'รอดำเนินการการคืน');

-- --------------------------------------------------------

--
-- Table structure for table `position_branches`
--

CREATE TABLE `position_branches` (
  `id` bigint UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `name` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `position_branches`
--

INSERT INTO `position_branches` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`) VALUES
(1, '2025-03-14 16:01:59.419', '2025-03-14 16:01:59.419', NULL, 'แอดมิน'),
(2, '2025-03-14 16:05:18.011', '2025-03-14 16:05:18.011', NULL, 'ประธานหลักสูตร'),
(3, '2025-03-15 19:42:53.174', '2025-03-15 19:42:53.174', NULL, 'อาจารย์ประจำสาขา');

-- --------------------------------------------------------

--
-- Table structure for table `position_facs`
--

CREATE TABLE `position_facs` (
  `id` bigint UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `name` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `position_facs`
--

INSERT INTO `position_facs` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`) VALUES
(1, '2025-03-14 16:02:53.204', '2025-03-14 16:02:53.204', NULL, 'แอดมิน'),
(2, '2025-03-14 16:04:01.803', '2025-03-15 20:00:37.515', NULL, 'คณบดี'),
(3, '2025-03-14 16:04:08.147', '2025-03-14 16:04:08.147', NULL, 'รองแผน'),
(4, '2025-03-15 19:31:18.527', '2025-03-15 19:31:18.527', NULL, 'พนักงานประจำ');

-- --------------------------------------------------------

--
-- Table structure for table `set_times`
--

CREATE TABLE `set_times` (
  `id` bigint UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `date_start` date NOT NULL,
  `date_stop` date NOT NULL,
  `time_start` varchar(10) NOT NULL,
  `time_stop` varchar(10) NOT NULL,
  `note` varchar(255) NOT NULL,
  `user_id` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `signatures`
--

CREATE TABLE `signatures` (
  `id` bigint UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `user_id` bigint UNSIGNED NOT NULL,
  `image_path` longtext NOT NULL,
  `image_name` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `units`
--

CREATE TABLE `units` (
  `id` bigint UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `name` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `units`
--

INSERT INTO `units` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`) VALUES
(1, '2025-03-15 20:11:23.658', '2025-03-15 20:11:23.658', NULL, 'ชุด'),
(2, '2025-03-15 20:11:27.890', '2025-03-15 20:11:27.890', NULL, 'เครื่อง'),
(3, '2025-03-15 20:11:34.021', '2025-03-15 20:11:34.021', NULL, 'ตัว');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint UNSIGNED NOT NULL,
  `created_at` datetime(3) DEFAULT NULL,
  `updated_at` datetime(3) DEFAULT NULL,
  `deleted_at` datetime(3) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `username` varchar(191) NOT NULL,
  `password` varchar(255) NOT NULL,
  `position_fac_id` bigint UNSIGNED DEFAULT NULL,
  `position_branch_id` bigint UNSIGNED DEFAULT NULL,
  `branch_id` bigint UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `created_at`, `updated_at`, `deleted_at`, `name`, `username`, `password`, `position_fac_id`, `position_branch_id`, `branch_id`) VALUES
(1, '2025-03-14 16:10:50.982', '2025-03-14 16:10:50.982', NULL, 'admin', 'admin', '$2a$10$InIgOzyOGULpJs7yQRl1nenQJtx6hlA5X3Id9a0A2AAq3Qf8UeF6q', 1, 1, 1),
(2, '2025-03-15 19:55:17.556', '2025-03-15 19:55:17.556', NULL, 'อาจารย์สมคิด ศิลป์วิทยารักษ์', 'somkit', '$2a$10$S9iJNnDKx3h8JAty3FaFn.5ogM3ed2RpGJHKtsE9oYtNncGQXelIW', 3, 2, 2),
(3, '2025-03-15 20:00:02.289', '2025-03-15 20:00:02.289', NULL, 'คณบดี', 'dean', '$2a$10$leotMgZfhj8TSx2pOM33u.ZddyDojOim9hGYAW9XEA/4vWFm56rBO', 2, 1, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `approval_statuses`
--
ALTER TABLE `approval_statuses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uni_approval_statuses_name` (`name`),
  ADD KEY `idx_approval_statuses_deleted_at` (`deleted_at`);

--
-- Indexes for table `borrow_lists`
--
ALTER TABLE `borrow_lists`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_borrow_lists_deleted_at` (`deleted_at`),
  ADD KEY `fk_borrow_lists_approval_status_return` (`approval_status_return_id`),
  ADD KEY `fk_borrow_lists_user` (`user_id`),
  ADD KEY `fk_borrow_lists_approval_status_borrow` (`approval_status_borrow_id`);

--
-- Indexes for table `borrow_list_details`
--
ALTER TABLE `borrow_list_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_borrow_list_details_deleted_at` (`deleted_at`),
  ADD KEY `fk_borrow_list_details_borrow_list` (`borrow_list_id`),
  ADD KEY `fk_borrow_list_details_equipment` (`equipment_id`);

--
-- Indexes for table `branches`
--
ALTER TABLE `branches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uni_branches_name` (`name`),
  ADD KEY `idx_branches_deleted_at` (`deleted_at`);

--
-- Indexes for table `budget_sources`
--
ALTER TABLE `budget_sources`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uni_budget_sources_name` (`name`),
  ADD KEY `idx_budget_sources_deleted_at` (`deleted_at`);

--
-- Indexes for table `equipment`
--
ALTER TABLE `equipment`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uni_equipment_code` (`code`),
  ADD KEY `idx_equipment_deleted_at` (`deleted_at`),
  ADD KEY `fk_equipment_equipment_status` (`equipment_status_id`),
  ADD KEY `fk_equipment_budget_source` (`budget_source_id`),
  ADD KEY `fk_equipment_unit` (`unit_id`),
  ADD KEY `fk_equipment_equipment_group` (`equipment_group_id`),
  ADD KEY `fk_equipment_equipment_name` (`equipment_name_id`);

--
-- Indexes for table `equipment_brokens`
--
ALTER TABLE `equipment_brokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_equipment_brokens_deleted_at` (`deleted_at`),
  ADD KEY `fk_equipment_brokens_equipment` (`equipment_id`),
  ADD KEY `fk_equipment_brokens_equipment_status` (`equipment_status_id`),
  ADD KEY `fk_equipment_brokens_user` (`user_id`);

--
-- Indexes for table `equipment_groups`
--
ALTER TABLE `equipment_groups`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uni_equipment_groups_name` (`name`),
  ADD UNIQUE KEY `uni_equipment_groups_code` (`code`),
  ADD KEY `idx_equipment_groups_deleted_at` (`deleted_at`);

--
-- Indexes for table `equipment_names`
--
ALTER TABLE `equipment_names`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uni_equipment_names_name` (`name`),
  ADD KEY `idx_equipment_names_deleted_at` (`deleted_at`);

--
-- Indexes for table `equipment_statuses`
--
ALTER TABLE `equipment_statuses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uni_equipment_statuses_name` (`name`),
  ADD KEY `idx_equipment_statuses_deleted_at` (`deleted_at`);

--
-- Indexes for table `position_branches`
--
ALTER TABLE `position_branches`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uni_position_branches_name` (`name`),
  ADD KEY `idx_position_branches_deleted_at` (`deleted_at`);

--
-- Indexes for table `position_facs`
--
ALTER TABLE `position_facs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uni_position_facs_name` (`name`),
  ADD KEY `idx_position_facs_deleted_at` (`deleted_at`);

--
-- Indexes for table `set_times`
--
ALTER TABLE `set_times`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_set_times_deleted_at` (`deleted_at`),
  ADD KEY `fk_set_times_user` (`user_id`);

--
-- Indexes for table `signatures`
--
ALTER TABLE `signatures`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_signatures_deleted_at` (`deleted_at`),
  ADD KEY `fk_signatures_user` (`user_id`);

--
-- Indexes for table `units`
--
ALTER TABLE `units`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uni_units_name` (`name`),
  ADD KEY `idx_units_deleted_at` (`deleted_at`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uni_users_username` (`username`),
  ADD KEY `idx_users_deleted_at` (`deleted_at`),
  ADD KEY `fk_users_position_fac` (`position_fac_id`),
  ADD KEY `fk_users_position_branch` (`position_branch_id`),
  ADD KEY `fk_users_branch` (`branch_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `approval_statuses`
--
ALTER TABLE `approval_statuses`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `borrow_lists`
--
ALTER TABLE `borrow_lists`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `borrow_list_details`
--
ALTER TABLE `borrow_list_details`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `branches`
--
ALTER TABLE `branches`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `budget_sources`
--
ALTER TABLE `budget_sources`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `equipment`
--
ALTER TABLE `equipment`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `equipment_brokens`
--
ALTER TABLE `equipment_brokens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `equipment_groups`
--
ALTER TABLE `equipment_groups`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `equipment_names`
--
ALTER TABLE `equipment_names`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `equipment_statuses`
--
ALTER TABLE `equipment_statuses`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `position_branches`
--
ALTER TABLE `position_branches`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `position_facs`
--
ALTER TABLE `position_facs`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `set_times`
--
ALTER TABLE `set_times`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `signatures`
--
ALTER TABLE `signatures`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `units`
--
ALTER TABLE `units`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `borrow_lists`
--
ALTER TABLE `borrow_lists`
  ADD CONSTRAINT `fk_borrow_lists_approval_status_borrow` FOREIGN KEY (`approval_status_borrow_id`) REFERENCES `approval_statuses` (`id`),
  ADD CONSTRAINT `fk_borrow_lists_approval_status_return` FOREIGN KEY (`approval_status_return_id`) REFERENCES `approval_statuses` (`id`),
  ADD CONSTRAINT `fk_borrow_lists_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `borrow_list_details`
--
ALTER TABLE `borrow_list_details`
  ADD CONSTRAINT `fk_borrow_list_details_borrow_list` FOREIGN KEY (`borrow_list_id`) REFERENCES `borrow_lists` (`id`),
  ADD CONSTRAINT `fk_borrow_list_details_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`);

--
-- Constraints for table `equipment`
--
ALTER TABLE `equipment`
  ADD CONSTRAINT `fk_equipment_budget_source` FOREIGN KEY (`budget_source_id`) REFERENCES `budget_sources` (`id`),
  ADD CONSTRAINT `fk_equipment_equipment_group` FOREIGN KEY (`equipment_group_id`) REFERENCES `equipment_groups` (`id`),
  ADD CONSTRAINT `fk_equipment_equipment_name` FOREIGN KEY (`equipment_name_id`) REFERENCES `equipment_names` (`id`),
  ADD CONSTRAINT `fk_equipment_equipment_status` FOREIGN KEY (`equipment_status_id`) REFERENCES `equipment_statuses` (`id`),
  ADD CONSTRAINT `fk_equipment_unit` FOREIGN KEY (`unit_id`) REFERENCES `units` (`id`);

--
-- Constraints for table `equipment_brokens`
--
ALTER TABLE `equipment_brokens`
  ADD CONSTRAINT `fk_equipment_brokens_equipment` FOREIGN KEY (`equipment_id`) REFERENCES `equipment` (`id`),
  ADD CONSTRAINT `fk_equipment_brokens_equipment_status` FOREIGN KEY (`equipment_status_id`) REFERENCES `equipment_statuses` (`id`),
  ADD CONSTRAINT `fk_equipment_brokens_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `set_times`
--
ALTER TABLE `set_times`
  ADD CONSTRAINT `fk_set_times_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `signatures`
--
ALTER TABLE `signatures`
  ADD CONSTRAINT `fk_signatures_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `fk_users_branch` FOREIGN KEY (`branch_id`) REFERENCES `branches` (`id`),
  ADD CONSTRAINT `fk_users_position_branch` FOREIGN KEY (`position_branch_id`) REFERENCES `position_branches` (`id`),
  ADD CONSTRAINT `fk_users_position_fac` FOREIGN KEY (`position_fac_id`) REFERENCES `position_facs` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
