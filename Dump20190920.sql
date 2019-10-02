-- MySQL dump 10.13  Distrib 8.0.16, for Win64 (x86_64)
--
-- Host: localhost    Database: ppj
-- ------------------------------------------------------
-- Server version	8.0.16

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `comments` (
  `indexid` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `masterid` bigint(20) unsigned DEFAULT NULL,
  `heartrate` int(11) NOT NULL,
  `content` varchar(600) DEFAULT NULL,
  `commentdate` date NOT NULL,
  `orderid` bigint(20) unsigned DEFAULT NULL,
  PRIMARY KEY (`indexid`),
  KEY `masterid` (`masterid`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,'王大明',17,5,'棒棒','2019-10-20',NULL),(2,'小白',17,4,'還行','2019-10-25',NULL),(5,'王大明',18,1,'貴','2019-10-25',NULL),(6,'小白',18,2,'爛','2019-10-25',NULL),(9,'小白',18,5,'GREAT','2019-09-17',20);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mailstatus`
--

DROP TABLE IF EXISTS `mailstatus`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `mailstatus` (
  `indexid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `activecode` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  PRIMARY KEY (`indexid`),
  KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mailstatus`
--

LOCK TABLES `mailstatus` WRITE;
/*!40000 ALTER TABLE `mailstatus` DISABLE KEYS */;
INSERT INTO `mailstatus` VALUES (16,'g777710@hotmail.com','b90cb24df62e8097ed5a95dcce3afb8631973eef01507f69292cf3811f782aa9','active'),(19,'g777710.ms98@gmail.com','252e75e71a88b6e560efa3f9d0ebf79e5947c130b1fe29d5d3f1aa0e98780fc3','active'),(25,'deathscythe.ms98@g2.nctu.edu.tw','cc9ea1fac745719bed06b9178f905626f8535777e94368a02a736b192621bb61','active'),(26,'g777710@yahoo.com.tw','64ad339a306428f70765da629e0b96aa7c599e81fbe43f0b1ff73048f406a885','active');
/*!40000 ALTER TABLE `mailstatus` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `master`
--

DROP TABLE IF EXISTS `master`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `master` (
  `masterid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `access_token` varchar(255) NOT NULL,
  `access_expired` varchar(255) NOT NULL,
  `account` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`masterid`),
  KEY `masterid` (`masterid`,`email`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `master`
--

LOCK TABLES `master` WRITE;
/*!40000 ALTER TABLE `master` DISABLE KEYS */;
INSERT INTO `master` VALUES (17,'李曉明','097788','g777710@hotmail.com','123','60a4cfa32df22bb358a97dcdea076dbcb4a41eaa5f10c27ec8f11661ee1a07b9','1568975622712','acct_1FHC9NDskdmwz7pH'),(18,'小黃','09112255','g777710.ms98@gmail.com','555','67899b315f700536a5881660d88dbecac861db982e140d26534829a04023c73e','1568985379972','acct_1FHC9NDskdmwz7pH'),(23,'DDD','0972171027','deathscythe.ms98@g2.nctu.edu.tw','0000','21a63119e47b651741ab5771734ba9f09a397575531bc0d3ac082b21d751d0cc','1568202977300','acct_1FHSYELuvYuYXhZg'),(24,'Daniel','0977777','g777710@yahoo.com.tw','333','b0f0d1fd01a17c9d2b956165e988b0e316a3a68916fb5ed30bce86ed910a168a','1568692586034','acct_1FJVtIJVJFSlAWC0');
/*!40000 ALTER TABLE `master` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `masterarea`
--

DROP TABLE IF EXISTS `masterarea`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `masterarea` (
  `indexid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `masterid` bigint(20) unsigned DEFAULT NULL,
  `area` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`indexid`),
  KEY `area` (`area`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `masterarea`
--

LOCK TABLES `masterarea` WRITE;
/*!40000 ALTER TABLE `masterarea` DISABLE KEYS */;
INSERT INTO `masterarea` VALUES (34,18,'基隆'),(44,23,'台北'),(45,23,'新北'),(46,17,'台北'),(47,17,'新北'),(48,17,'基隆'),(49,24,'苗栗');
/*!40000 ALTER TABLE `masterarea` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `masterdate`
--

DROP TABLE IF EXISTS `masterdate`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `masterdate` (
  `indexid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `masterid` bigint(20) unsigned DEFAULT NULL,
  `workdate` date NOT NULL,
  PRIMARY KEY (`indexid`),
  KEY `workdate` (`workdate`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `masterdate`
--

LOCK TABLES `masterdate` WRITE;
/*!40000 ALTER TABLE `masterdate` DISABLE KEYS */;
INSERT INTO `masterdate` VALUES (4,17,'2019-09-30'),(5,18,'2019-10-27'),(6,18,'2019-10-28');
/*!40000 ALTER TABLE `masterdate` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `masterskill`
--

DROP TABLE IF EXISTS `masterskill`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `masterskill` (
  `indexid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `masterid` bigint(20) unsigned DEFAULT NULL,
  `light` int(11) DEFAULT NULL,
  `toilet` int(11) DEFAULT NULL,
  `waterheater` int(11) DEFAULT NULL,
  `pipe` int(11) DEFAULT NULL,
  `faucet` int(11) DEFAULT NULL,
  `bathtub` int(11) DEFAULT NULL,
  `wire` int(11) DEFAULT NULL,
  `soil` int(11) DEFAULT NULL,
  `paint` int(11) DEFAULT NULL,
  `wallpaper` int(11) DEFAULT NULL,
  `tile` int(11) DEFAULT NULL,
  PRIMARY KEY (`indexid`),
  KEY `light` (`light`,`toilet`,`waterheater`,`pipe`,`faucet`,`bathtub`,`wire`,`soil`,`paint`,`wallpaper`,`tile`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `masterskill`
--

LOCK TABLES `masterskill` WRITE;
/*!40000 ALTER TABLE `masterskill` DISABLE KEYS */;
INSERT INTO `masterskill` VALUES (12,18,1,NULL,NULL,1,1,NULL,1,1,NULL,NULL,NULL),(17,23,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(18,17,1,NULL,NULL,NULL,NULL,1,NULL,NULL,1,NULL,NULL),(19,24,NULL,NULL,NULL,NULL,1,NULL,NULL,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `masterskill` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `orders` (
  `indexid` bigint(20) NOT NULL AUTO_INCREMENT,
  `status` varchar(255) NOT NULL,
  `code` varchar(255) NOT NULL,
  `userid` bigint(20) unsigned NOT NULL,
  `masterid` bigint(20) unsigned NOT NULL,
  `originquote` bigint(20) unsigned DEFAULT NULL,
  `finalquote` bigint(20) unsigned DEFAULT NULL,
  `orderdate` date NOT NULL,
  `workdate` date NOT NULL,
  `tooldetails` varchar(255) DEFAULT NULL,
  `orderskill` varchar(255) NOT NULL,
  `orderarea` varchar(255) NOT NULL,
  `ordertext` varchar(255) DEFAULT NULL,
  `tooldetailsfinal` varchar(255) DEFAULT NULL,
  `paymentid` varchar(255) DEFAULT NULL,
  `paytomaster` bigint(20) unsigned DEFAULT NULL,
  `transactionid` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`indexid`),
  KEY `masterid` (`masterid`,`userid`,`code`,`status`)
) ENGINE=InnoDB AUTO_INCREMENT=36 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (15,'quoted','gc0908260',1,17,550,1655,'2019-09-02','2019-10-10','{\"補土\":100,\"虹牌全效乳膠漆百合白 1 加侖\":950}','light','基隆','燈泡一閃一閃','{\"補土\":199,\"虹牌全效乳膠漆百合白 1 加侖\":910}',NULL,1600,NULL,'台北市天龍國平民區111'),(16,'paid','ab1234567',2,17,3000,4350,'2019-09-01','2019-10-08','{\"補土\":100,\"虹牌全效乳膠漆百合白 1 加侖\":950}','light','基隆','燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮燈泡不亮','{\"補土\":50,\"虹牌全效乳膠漆百合白 1 加侖\":910}',NULL,4050,NULL,'天龍國天母區小碗櫥'),(20,'closed','qv0201775',2,18,550,1655,'2019-09-09','2019-09-27','{\"補土\":100,\"虹牌全效乳膠漆百合白 1 加侖\":950}','pipe','基隆','水管阻塞','{\"補土\":199,\"虹牌全效乳膠漆百合白 1 加侖\":910}','ch_1FHUseEyLn95tpELbqslM4Q3',1600,'tr_1FHVAhEyLn95tpELnpNGmXef','天龍國天母區小碗櫥'),(21,'quoted','cs0354339',2,18,500,550,'2019-09-09','2019-09-15',NULL,'wire','基隆','電線斷了',NULL,NULL,500,NULL,'天龍國'),(23,'paid','qi0661304',1,17,6000,7650,'2019-09-12','2019-09-30','{\"補土\":100,\"虹牌全效乳膠漆百合白 1 加侖\":950}','paint','新北','333','{\"補土\":528,\"虹牌全效乳膠漆百合白 1 加侖\":910}','ch_1FJ99MEyLn95tpEL5IxK9U7c',7050,NULL,'台北市天龍國平民區111'),(24,'quoted','ru0535771',1,18,7000,7700,'2019-09-16','2019-09-25',NULL,'soil','基隆','456',NULL,NULL,7000,NULL,'天龍國天龍區'),(25,'quoted','xk0271633',1,17,800,880,'2019-09-16','2019-09-28',NULL,'bathtub','台北','浴缸破了',NULL,NULL,800,NULL,'天龍國'),(30,'quoted','sm0794985',2,18,456,502,'2019-09-16','2019-09-29',NULL,'light,wire','基隆','777',NULL,NULL,456,NULL,'天龍國'),(31,'created','tm0661047',1,24,NULL,NULL,'2019-09-19','2019-09-29',NULL,'faucet','苗栗','999',NULL,NULL,NULL,NULL,'天龍國'),(32,'created','nj0273782',1,23,NULL,NULL,'2019-09-19','2019-10-18',NULL,'waterheater','台北','AAA',NULL,NULL,NULL,NULL,'天龍國'),(33,'paid','pv0378005',1,18,999,1099,'2019-09-19','2019-10-28',NULL,'light','基隆','A9A',NULL,'ch_1FKhM7EyLn95tpELT7YKNUky',999,NULL,'台北市天龍國平民區111'),(34,'created','ea092810',1,17,NULL,NULL,'2019-09-19','2019-10-12',NULL,'paint','新北','AAA',NULL,NULL,300,NULL,'天龍國'),(35,'closed','pz0789648',1,18,789,868,'2019-09-19','2019-10-27',NULL,'wire,soil','基隆','999',NULL,'ch_1FKg5GEyLn95tpELFBkitIM7',789,'tr_1FKg84EyLn95tpELAaHO3Wvz','天龍國');
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `user` (
  `userid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `address` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `access_token` varchar(255) NOT NULL,
  `access_expired` varchar(255) NOT NULL,
  PRIMARY KEY (`userid`),
  KEY `userid` (`userid`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'王大明','09112233','台北市天龍國平民區111','0123','3f38fcaec7419fb0fb953c5bb08c6d5f3a35576c20e2c0a37f88ea506d9e4691','1568985392738'),(2,'小白','09525252','天龍國地下室','525252','aa0646f1f3ed3e680ccb43e9182c593393efc8c09bdcdb3ecfbcefdab4023d46','1568718531975');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-09-20 19:41:48
