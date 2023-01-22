-- MySQL dump 10.13  Distrib 8.0.31, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: interfejsy
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `data_zajec`
--

DROP TABLE IF EXISTS `data_zajec`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `data_zajec` (
  `data_id` int NOT NULL AUTO_INCREMENT,
  `dzien` varchar(255) NOT NULL,
  `nr_lekcji` int NOT NULL,
  `zajecia_id` int NOT NULL,
  PRIMARY KEY (`data_id`),
  KEY `data_zajec_zajecia_id_foreign` (`zajecia_id`),
  CONSTRAINT `data_zajec_ibfk_1` FOREIGN KEY (`zajecia_id`) REFERENCES `zajecia` (`zajecia_id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_zajec`
--

LOCK TABLES `data_zajec` WRITE;
/*!40000 ALTER TABLE `data_zajec` DISABLE KEYS */;
INSERT INTO `data_zajec` VALUES (12,'Poniedzialek',1,9),(13,'Poniedzialek',3,9),(14,'Poniedzialek',2,10),(15,'Poniedzialek',4,11),(16,'Poniedzialek',5,11),(17,'Wtorek',1,9),(18,'Wtorek',2,9),(19,'Wtorek',3,10),(20,'Wtorek',4,10),(21,'Wtorek',5,11),(22,'Sroda',6,11),(23,'Wtorek',6,11),(24,'Sroda',1,10),(25,'Sroda',2,10),(26,'Sroda',3,11),(27,'Sroda',4,9),(28,'Sroda',5,9),(29,'Czwartek',1,10),(30,'Czwartek',2,10),(31,'Czwartek',3,9),(32,'Czwartek',4,10),(33,'Czwartek',5,11),(34,'Piatek',1,11),(35,'Piatek',2,11),(36,'Piatek',3,10),(37,'Piatek',4,9),(38,'Piatek',5,9);
/*!40000 ALTER TABLE `data_zajec` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `frekwencja`
--

DROP TABLE IF EXISTS `frekwencja`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `frekwencja` (
  `zajecia_id` int NOT NULL,
  `user_id` int NOT NULL,
  `data_zajec` date NOT NULL,
  `frekwencja` varchar(255) NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `nr_lekcji` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `frekwencja_user_id_foreign` (`user_id`),
  KEY `frekwencja_zajecia_id_foreign` (`zajecia_id`),
  CONSTRAINT `frekwencja_ibfk_907` FOREIGN KEY (`zajecia_id`) REFERENCES `zajecia` (`zajecia_id`),
  CONSTRAINT `frekwencja_ibfk_908` FOREIGN KEY (`user_id`) REFERENCES `uzytkownik` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `frekwencja`
--

LOCK TABLES `frekwencja` WRITE;
/*!40000 ALTER TABLE `frekwencja` DISABLE KEYS */;
INSERT INTO `frekwencja` VALUES (9,32,'2023-01-16','N',1,3),(9,17,'2023-01-16','O',2,3),(9,31,'2023-01-16','N',3,3),(9,33,'2023-01-16','N',4,3),(9,34,'2023-01-16','O',5,3),(9,35,'2023-01-16','S',6,3),(9,36,'2023-01-16','O',7,3),(9,37,'2023-01-16','O',8,3),(9,17,'2023-01-16','O',9,1),(9,32,'2023-01-16','N',10,1),(9,33,'2023-01-16','N',11,1),(9,31,'2023-01-16','S',12,1),(9,34,'2023-01-16','N',13,1),(9,35,'2023-01-16','O',14,1),(9,37,'2023-01-16','O',15,1),(9,36,'2023-01-16','Z',16,1),(9,32,'2023-01-17','O',17,1),(9,17,'2023-01-17','N',18,1),(9,31,'2023-01-17','N',19,1),(9,33,'2023-01-17','N',20,1),(9,34,'2023-01-17','O',21,1),(9,35,'2023-01-17','O',22,1),(9,36,'2023-01-17','N',23,1),(9,37,'2023-01-17','O',24,1),(9,32,'2023-01-17','O',25,2),(9,17,'2023-01-17','S',26,2),(9,31,'2023-01-17','O',27,2),(9,34,'2023-01-17','O',28,2),(9,33,'2023-01-17','S',29,2),(9,35,'2023-01-17','Z',30,2),(9,36,'2023-01-17','Z',31,2),(9,37,'2023-01-17','Z',32,2),(9,31,'2023-01-18','O',33,1),(9,17,'2023-01-18','O',34,1),(9,32,'2023-01-18','O',35,1),(9,33,'2023-01-18','O',36,1),(9,34,'2023-01-18','O',37,1),(9,35,'2023-01-18','O',38,1),(9,36,'2023-01-18','O',39,1),(9,37,'2023-01-18','O',40,1),(9,17,'2023-01-18','S',41,5),(9,31,'2023-01-18','O',42,5),(9,33,'2023-01-18','S',43,5),(9,32,'2023-01-18','O',44,5),(9,34,'2023-01-18','S',45,5),(9,35,'2023-01-18','S',46,5),(9,36,'2023-01-18','O',47,5),(9,37,'2023-01-18','O',48,5),(9,17,'2023-01-19','N',49,5),(9,31,'2023-01-19','N',50,5),(9,33,'2023-01-19','S',51,5),(9,32,'2023-01-19','O',52,5),(9,34,'2023-01-19','S',53,5),(9,35,'2023-01-19','O',54,5),(9,36,'2023-01-19','Z',55,5),(9,37,'2023-01-19','O',56,5),(9,33,'2023-01-20','U',57,3),(9,17,'2023-01-20','O',58,3),(9,31,'2023-01-20','S',59,3),(9,34,'2023-01-20','O',60,3),(9,32,'2023-01-20','O',61,3),(9,35,'2023-01-20','N',62,3),(9,36,'2023-01-20','S',63,3),(9,37,'2023-01-20','O',64,3),(9,33,'2023-01-20','O',65,5),(9,17,'2023-01-20','N',66,5),(9,31,'2023-01-20','S',67,5),(9,34,'2023-01-20','N',68,5),(9,32,'2023-01-20','S',69,5),(9,35,'2023-01-20','O',70,5),(9,36,'2023-01-20','O',71,5),(9,37,'2023-01-20','N',72,5);
/*!40000 ALTER TABLE `frekwencja` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `klasa`
--

DROP TABLE IF EXISTS `klasa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `klasa` (
  `klasa_id` int NOT NULL AUTO_INCREMENT,
  `wychowawca_id` int NOT NULL,
  PRIMARY KEY (`klasa_id`),
  KEY `klasa_wychowawca_id_foreign` (`wychowawca_id`),
  CONSTRAINT `klasa_ibfk_1` FOREIGN KEY (`wychowawca_id`) REFERENCES `uzytkownik` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `klasa`
--

LOCK TABLES `klasa` WRITE;
/*!40000 ALTER TABLE `klasa` DISABLE KEYS */;
INSERT INTO `klasa` VALUES (1,18),(2,22),(3,23);
/*!40000 ALTER TABLE `klasa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `oceny`
--

DROP TABLE IF EXISTS `oceny`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oceny` (
  `ocena_id` int NOT NULL AUTO_INCREMENT,
  `ocena` int NOT NULL,
  `user_id` int NOT NULL,
  `zajecia_id` int NOT NULL,
  PRIMARY KEY (`ocena_id`),
  KEY `oceny_user_id_foreign` (`user_id`),
  KEY `oceny_zajecia_id_foreign` (`zajecia_id`),
  CONSTRAINT `oceny_ibfk_903` FOREIGN KEY (`user_id`) REFERENCES `uzytkownik` (`user_id`),
  CONSTRAINT `oceny_ibfk_904` FOREIGN KEY (`zajecia_id`) REFERENCES `zajecia` (`zajecia_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oceny`
--

LOCK TABLES `oceny` WRITE;
/*!40000 ALTER TABLE `oceny` DISABLE KEYS */;
INSERT INTO `oceny` VALUES (3,4,17,9),(4,6,17,9),(5,1,17,9),(6,4,31,9),(7,4,32,9),(8,4,33,9),(9,4,34,9),(10,4,35,9),(11,2,32,9),(12,2,33,9),(13,2,34,9),(14,2,35,9),(15,2,36,9),(16,2,37,9),(17,5,31,9),(18,1,36,9),(19,1,37,9),(20,3,31,9),(21,3,32,9),(22,3,33,9),(23,4,34,9),(24,4,35,9),(25,4,36,9),(26,4,37,9);
/*!40000 ALTER TABLE `oceny` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ogloszenia`
--

DROP TABLE IF EXISTS `ogloszenia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ogloszenia` (
  `id` int NOT NULL AUTO_INCREMENT,
  `tytul` varchar(255) NOT NULL,
  `tresc` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ogloszenia`
--

LOCK TABLES `ogloszenia` WRITE;
/*!40000 ALTER TABLE `ogloszenia` DISABLE KEYS */;
INSERT INTO `ogloszenia` VALUES (3,'Rekrutacja na wyjazdy w ramach wymiany Erasmus+','Ogłoszenie dla studentów Wydziału Zarządzania i Komunikacji Społecznej dotyczące rekrutacji na wyjazdy w ramach wymiany Erasmus+'),(4,'Podania - uruchomienie na kolejnych Wydziałach','Od 2 stycznia 2023 roku możliwość składania podań poprzez system USOSWeb będzie dostępna dla studentów:\r\n\r\nWydziału Lekarskiego\r\nWydziału Nauk o Zdrowiu\r\nOd dnia 15 grudnia 2022 roku możliwość składania podań jest dostępna również dla studentów Wydziału Filologicznego.'),(5,'Centrum Językowe Uniwersytetu Jagiellońskiego - Collegium Medicum - ogłoszenia','Rejestracja na lektoraty, CJ CM, rejestracja żetonowa\r\nI tura: 22.09.2022 10:00 - 07.10.2022 23:59\r\nII tura: 14.10.2022 10:00 - 21.10.2022 23:00\r\nLink do rejestracji');
/*!40000 ALTER TABLE `ogloszenia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `przedmioty`
--

DROP TABLE IF EXISTS `przedmioty`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `przedmioty` (
  `przedmiot_id` int NOT NULL AUTO_INCREMENT,
  `nazwa` varchar(255) NOT NULL,
  PRIMARY KEY (`przedmiot_id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `przedmioty`
--

LOCK TABLES `przedmioty` WRITE;
/*!40000 ALTER TABLE `przedmioty` DISABLE KEYS */;
INSERT INTO `przedmioty` VALUES (1,'j. Polski'),(2,'Matematyka'),(3,'Biologia'),(4,'Chemia'),(5,'Fizyka'),(6,'Geografia'),(7,'Historia'),(8,'Informatyka'),(9,'j. Angielski'),(10,'j. Niemiecki'),(11,'Muzyka'),(12,'Plastyka'),(13,'WOS'),(14,'Technika'),(15,'Wychowanie fizyczne');
/*!40000 ALTER TABLE `przedmioty` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rodzicielstwo`
--

DROP TABLE IF EXISTS `rodzicielstwo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rodzicielstwo` (
  `dziecko_id` int NOT NULL,
  `rodzic_id` int NOT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  KEY `rodzicielstwo_dziecko_id_foreign` (`dziecko_id`),
  KEY `rodzicielstwo_rodzic_id_foreign` (`rodzic_id`),
  CONSTRAINT `rodzicielstwo_ibfk_1` FOREIGN KEY (`dziecko_id`) REFERENCES `uzytkownik` (`user_id`),
  CONSTRAINT `rodzicielstwo_ibfk_2` FOREIGN KEY (`rodzic_id`) REFERENCES `uzytkownik` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rodzicielstwo`
--

LOCK TABLES `rodzicielstwo` WRITE;
/*!40000 ALTER TABLE `rodzicielstwo` DISABLE KEYS */;
INSERT INTO `rodzicielstwo` VALUES (17,20,1),(31,20,2),(32,25,3),(33,25,4),(34,22,5),(35,22,6),(36,22,7),(37,23,8),(38,20,9),(39,22,10),(40,20,11),(41,20,12),(42,20,13),(43,21,14),(44,18,15),(45,23,16);
/*!40000 ALTER TABLE `rodzicielstwo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sala`
--

DROP TABLE IF EXISTS `sala`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sala` (
  `sala_id` int NOT NULL AUTO_INCREMENT,
  `nazwa` varchar(255) NOT NULL,
  PRIMARY KEY (`sala_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sala`
--

LOCK TABLES `sala` WRITE;
/*!40000 ALTER TABLE `sala` DISABLE KEYS */;
INSERT INTO `sala` VALUES (1,'A1'),(2,'A2'),(3,'A3'),(4,'B1'),(5,'B2'),(6,'B3');
/*!40000 ALTER TABLE `sala` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `uzytkownik`
--

DROP TABLE IF EXISTS `uzytkownik`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `uzytkownik` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `haslo` varchar(255) NOT NULL,
  `imie` varchar(255) NOT NULL,
  `nazwisko` varchar(255) NOT NULL,
  `pesel` varchar(255) NOT NULL,
  `data_urodzenia` date NOT NULL,
  `miasto` varchar(255) NOT NULL,
  `kod_pocztowy` varchar(255) NOT NULL,
  `ulica` varchar(255) NOT NULL,
  `nr_mieszkania` varchar(255) NOT NULL,
  `rola` varchar(255) NOT NULL,
  `klasa_id` int DEFAULT NULL,
  `aktywny` tinyint(1) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `uzytkownik_email_unique` (`email`),
  KEY `uzytkownik_klasa_id_foreign` (`klasa_id`),
  CONSTRAINT `uzytkownik_ibfk_1` FOREIGN KEY (`klasa_id`) REFERENCES `klasa` (`klasa_id`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uzytkownik`
--

LOCK TABLES `uzytkownik` WRITE;
/*!40000 ALTER TABLE `uzytkownik` DISABLE KEYS */;
INSERT INTO `uzytkownik` VALUES (16,'dominik.mazurek@administrator.dziennikuj.pl','administrator123','Dominik','Mazurek','00000000000','1992-07-12','Krakow','30-307','Lubuska','33/17','4',NULL,1),(17,'jan.kowalski@uczen.dziennikuj.pl','uczen123','Jan','Kowalski','12312312312','2000-05-03','Krakow','30-302','Ludowa','23/3','1',1,1),(18,'joanna.kowalska@rodzic.dziennikuj.pl','rodzic123','Joanna','Kowalska','12312312312','1990-02-01','Krakow','30-302','Ludowa','23/3','2',NULL,1),(19,'pawel.kowal@nauczyciel.dziennikuj.pl','nauczyciel123','Pawel','Kowal','12312312312','1996-01-04','Krakow','30-302','Gwarna','11/1','3',NULL,1),(20,'katarzyna.jakubowska@rodzic.dziennikuj.pl','rodzic123','Katarzyna','Jakubowska','427644906445','1990-02-01','Warszawa','30-302','Lubuska','12/14','2',NULL,1),(21,'danuta.olszewskia@rodzic.dziennikuj.pl','rodzic123','Danuta','Olszewskia','347355401454','1990-02-01','Wroclaw','30-302','Parna','12/14','2',NULL,1),(22,'ewa.szulc@rodzic.dziennikuj.pl','rodzic123','Ewa','Szulc','832231640858','1990-02-01','Lublin','30-302','Radosna','12/14','2',NULL,1),(23,'tadeusz.ziolkowski@rodzic.dziennikuj.pl','rodzic123','Tadeusz','Ziolkowski','877317900758','1990-02-01','Kielce','30-302','Sloneczka','12/14','2',NULL,1),(24,'damian.wieczorek@rodzic.dziennikuj.pl','rodzic123','Damian','Wieczorek','722187483498','1990-02-01','Warszawa','30-302','Radosna','12/14','2',NULL,1),(25,'jerzy.piotrowski@rodzic.dziennikuj.pl','rodzic123','Jerzy','Piotrowski','740583309118','1990-02-01','Kielce','30-302','Parna','12/14','2',NULL,1),(26,'iwona.kwiatkowska@nauczyciel.dziennikuj.pl','nauczyciel123','Iwona','Kwiatkowska','851437231509','1988-06-03','Warszawa','30-333','Parna','12/14','3',NULL,1),(27,'malgorzata.walczak@nauczyciel.dziennikuj.pl','nauczyciel123','Malgorzata','Walczak','511184414862','1988-06-03','Warszawa','30-333','Parna','12/14','3',NULL,1),(28,'barbara.krawczyk@nauczyciel.dziennikuj.pl','nauczyciel123','Barbara','Krawczyk','199588773433','1988-06-03','Warszawa','30-333','Radosna','12/14','3',NULL,1),(29,'janina.kozlowska@nauczyciel.dziennikuj.pl','nauczyciel123','Janina','Kozlowska','681737335237','1988-06-03','Lublin','30-333','Sloneczka','12/14','3',NULL,1),(30,'marta.czerwinska@nauczyciel.dziennikuj.pl','nauczyciel123','Marta','Czerwinska','758821445279','1988-06-03','Warszawa','30-333','Wesola','12/14','3',NULL,1),(31,'marianna.szymczak@uczen.dziennikuj.pl','uczen123','Marianna','Szymczak','735623349161','1988-06-03','Warszawa','30-333','Parna','12/14','1',1,1),(32,'marzena.wrobel@uczen.dziennikuj.pl','uczen123','Marzena','Wrobel','349082485028','1988-06-03','Warszawa','30-333','Lubuska','12/14','1',1,1),(33,'izabela.szczepanska@uczen.dziennikuj.pl','uczen123','Izabela','Szczepanska','984141695691','1988-06-03','Warszawa','30-333','Lubuska','12/14','1',1,1),(34,'malgorzata.krol@uczen.dziennikuj.pl','uczen123','Malgorzata','Krol','809623951459','1988-06-03','Kielce','30-333','Radosna','12/14','1',1,1),(35,'renata.sawicka@uczen.dziennikuj.pl','uczen123','Renata','Sawicka','464638748939','1988-06-03','Warszawa','30-333','Radosna','12/14','1',1,1),(36,'daniel.urbanski@uczen.dziennikuj.pl','uczen123','Daniel','Urbanski','889340033611','1988-06-03','Warszawa','30-333','Sloneczka','12/14','1',1,1),(37,'mieczyslaw.brzezinski@uczen.dziennikuj.pl','uczen123','Mieczyslaw','Brzezinski','274920525104','1988-06-03','Warszawa','30-333','Lubuska','12/14','1',1,1),(38,'dawid.krajewski@uczen.dziennikuj.pl','uczen123','Dawid','Krajewski','166349294556','1988-06-03','Warszawa','30-333','Parna','12/14','1',2,1),(39,'jerzy.lis@uczen.dziennikuj.pl','uczen123','Jerzy','Lis','666398145641','1988-06-03','Kielce','30-333','Wesola','12/14','1',2,1),(40,'zbigniew.wlodarczyk@uczen.dziennikuj.pl','uczen123','Zbigniew','Wlodarczyk','167541625537','1988-06-03','Kielce','30-333','Lubuska','12/14','1',2,1),(41,'grzegorz.kubiak@uczen.dziennikuj.pl','uczen123','Grzegorz','Kubiak','863498691241','1988-06-03','Krakow','30-333','Lubuska','12/14','1',2,1),(42,'miroslaw.gorski@uczen.dziennikuj.pl','uczen123','Miroslaw','Gorski','322711051886','1988-06-03','Kielce','30-333','Radosna','12/14','1',2,1),(43,'adam.zawadzki@uczen.dziennikuj.pl','uczen123','Adam','Zawadzki','570922783590','1988-06-03','Krakow','30-333','Radosna','12/14','1',2,1),(44,'maciej.zajac@uczen.dziennikuj.pl','uczen123','Maciej','Zajac','153276142032','1988-06-03','Kielce','30-333','Wesola','12/14','1',2,1),(45,'kamil.kalinowski@uczen.dziennikuj.pl','uczen123','Kamil','Kalinowski','698986334097','1988-06-03','Krakow','30-333','Parna','12/14','1',2,1);
/*!40000 ALTER TABLE `uzytkownik` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wiadomosc`
--

DROP TABLE IF EXISTS `wiadomosc`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wiadomosc` (
  `wiadomosc_id` int NOT NULL AUTO_INCREMENT,
  `nadawca_id` int NOT NULL,
  `odbiorca_id` int NOT NULL,
  `typ` varchar(255) NOT NULL,
  `data` date NOT NULL,
  `tytul` varchar(255) NOT NULL,
  `tresc` text,
  `odczytana` tinyint(1) NOT NULL,
  `usunieta` int NOT NULL,
  PRIMARY KEY (`wiadomosc_id`),
  KEY `wiadomosc_nadawca_id_foreign` (`nadawca_id`),
  KEY `wiadomosc_odbiorca_id_foreign` (`odbiorca_id`),
  CONSTRAINT `wiadomosc_ibfk_1` FOREIGN KEY (`nadawca_id`) REFERENCES `uzytkownik` (`user_id`),
  CONSTRAINT `wiadomosc_ibfk_2` FOREIGN KEY (`odbiorca_id`) REFERENCES `uzytkownik` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wiadomosc`
--

LOCK TABLES `wiadomosc` WRITE;
/*!40000 ALTER TABLE `wiadomosc` DISABLE KEYS */;
INSERT INTO `wiadomosc` VALUES (1,17,17,'2','2023-01-19','Twoje oceny z przedmiotu Matematyka uległy zmianie',NULL,0,0),(2,20,20,'2','2023-01-19','Oceny dziecka Jan Kowalski uległy zmianie',NULL,0,0),(3,17,17,'2','2023-01-19','Twoje oceny z przedmiotu Matematyka uległy zmianie',NULL,0,0),(4,20,20,'2','2023-01-19','Oceny dziecka Jan Kowalski uległy zmianie',NULL,0,0),(5,17,17,'2','2023-01-19','Twoje oceny z przedmiotu Matematyka uległy zmianie',NULL,0,0),(6,20,20,'2','2023-01-19','Oceny dziecka Jan Kowalski uległy zmianie',NULL,0,0),(7,31,31,'2','2023-01-19','Twoje oceny z przedmiotu Matematyka uległy zmianie',NULL,0,0),(8,20,20,'2','2023-01-19','Oceny dziecka Marianna Szymczak uległy zmianie',NULL,0,0),(9,32,32,'2','2023-01-19','Twoje oceny z przedmiotu Matematyka uległy zmianie',NULL,0,0),(10,25,25,'2','2023-01-19','Oceny dziecka Marzena Wrobel uległy zmianie',NULL,0,0),(11,33,33,'2','2023-01-19','Twoje oceny z przedmiotu Matematyka uległy zmianie',NULL,0,0),(12,25,25,'2','2023-01-19','Oceny dziecka Izabela Szczepanska uległy zmianie',NULL,0,0),(13,34,34,'2','2023-01-19','Twoje oceny z przedmiotu Matematyka uległy zmianie',NULL,0,0),(14,22,22,'2','2023-01-19','Oceny dziecka Malgorzata Krol uległy zmianie',NULL,0,0),(15,35,35,'2','2023-01-19','Twoje oceny z przedmiotu Matematyka uległy zmianie',NULL,0,0),(16,22,22,'2','2023-01-19','Oceny dziecka Renata Sawicka uległy zmianie',NULL,0,0),(17,32,32,'2','2023-01-19','Twoje oceny z przedmiotu Matematyka uległy zmianie',NULL,0,0),(18,25,25,'2','2023-01-19','Oceny dziecka Marzena Wrobel uległy zmianie',NULL,0,0),(19,33,33,'2','2023-01-19','Twoje oceny z przedmiotu Matematyka uległy zmianie',NULL,0,0),(20,25,25,'2','2023-01-19','Oceny dziecka Izabela Szczepanska uległy zmianie',NULL,0,0),(21,34,34,'2','2023-01-19','Twoje oceny z przedmiotu Matematyka uległy zmianie',NULL,0,0),(22,22,22,'2','2023-01-19','Oceny dziecka Malgorzata Krol uległy zmianie',NULL,0,0),(23,35,35,'2','2023-01-19','Twoje oceny z przedmiotu Matematyka uległy zmianie',NULL,0,0),(24,22,22,'2','2023-01-19','Oceny dziecka Renata Sawicka uległy zmianie',NULL,0,0),(25,36,36,'2','2023-01-19','Twoje oceny z przedmiotu Matematyka uległy zmianie',NULL,0,0),(26,22,22,'2','2023-01-19','Oceny dziecka Daniel Urbanski uległy zmianie',NULL,0,0),(27,37,37,'2','2023-01-19','Twoje oceny z przedmiotu Matematyka uległy zmianie',NULL,0,0),(28,23,23,'2','2023-01-19','Oceny dziecka Mieczyslaw Brzezinski uległy zmianie',NULL,0,0),(29,31,31,'2','2023-01-19','Twoje oceny z przedmiotu Matematyka uległy zmianie',NULL,0,0),(30,20,20,'2','2023-01-19','Oceny dziecka Marianna Szymczak uległy zmianie',NULL,0,0),(31,36,36,'2','2023-01-19','Twoje oceny z przedmiotu Matematyka uległy zmianie',NULL,0,0),(32,22,22,'2','2023-01-19','Oceny dziecka Daniel Urbanski uległy zmianie',NULL,0,0),(33,37,37,'2','2023-01-19','Twoje oceny z przedmiotu Matematyka uległy zmianie',NULL,0,0),(34,23,23,'2','2023-01-19','Oceny dziecka Mieczyslaw Brzezinski uległy zmianie',NULL,0,0),(35,31,31,'2','2023-01-19','Twoje oceny z przedmiotu Matematyka uległy zmianie',NULL,0,0),(36,20,20,'2','2023-01-19','Oceny dziecka Marianna Szymczak uległy zmianie',NULL,0,0),(37,32,32,'2','2023-01-19','Twoje oceny z przedmiotu Matematyka uległy zmianie',NULL,0,0),(38,25,25,'2','2023-01-19','Oceny dziecka Marzena Wrobel uległy zmianie',NULL,0,0),(39,33,33,'2','2023-01-19','Twoje oceny z przedmiotu Matematyka uległy zmianie',NULL,0,0),(40,25,25,'2','2023-01-19','Oceny dziecka Izabela Szczepanska uległy zmianie',NULL,0,0),(41,34,34,'2','2023-01-19','Twoje oceny z przedmiotu Matematyka uległy zmianie',NULL,0,0),(42,22,22,'2','2023-01-19','Oceny dziecka Malgorzata Krol uległy zmianie',NULL,0,0),(43,35,35,'2','2023-01-19','Twoje oceny z przedmiotu Matematyka uległy zmianie',NULL,0,0),(44,22,22,'2','2023-01-19','Oceny dziecka Renata Sawicka uległy zmianie',NULL,0,0),(45,36,36,'2','2023-01-19','Twoje oceny z przedmiotu Matematyka uległy zmianie',NULL,0,0),(46,22,22,'2','2023-01-19','Oceny dziecka Daniel Urbanski uległy zmianie',NULL,0,0),(47,37,37,'2','2023-01-19','Twoje oceny z przedmiotu Matematyka uległy zmianie',NULL,0,0),(48,23,23,'2','2023-01-19','Oceny dziecka Mieczyslaw Brzezinski uległy zmianie',NULL,0,0);
/*!40000 ALTER TABLE `wiadomosc` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zadanie_domowe`
--

DROP TABLE IF EXISTS `zadanie_domowe`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `zadanie_domowe` (
  `zadanie_id` int NOT NULL AUTO_INCREMENT,
  `zajecia_id` int NOT NULL,
  `termin_oddania` date NOT NULL,
  `tytul` varchar(255) NOT NULL,
  `opis` text NOT NULL,
  PRIMARY KEY (`zadanie_id`),
  KEY `zadanie_domowe_zajecia_id_foreign` (`zajecia_id`),
  CONSTRAINT `zadanie_domowe_ibfk_1` FOREIGN KEY (`zajecia_id`) REFERENCES `zajecia` (`zajecia_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zadanie_domowe`
--

LOCK TABLES `zadanie_domowe` WRITE;
/*!40000 ALTER TABLE `zadanie_domowe` DISABLE KEYS */;
INSERT INTO `zadanie_domowe` VALUES (3,9,'2023-01-21','Ułamki','strona 22/23'),(4,9,'2023-01-27','potegowanie','strona 30/33');
/*!40000 ALTER TABLE `zadanie_domowe` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `zajecia`
--

DROP TABLE IF EXISTS `zajecia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `zajecia` (
  `zajecia_id` int NOT NULL AUTO_INCREMENT,
  `przedmiot_id` int NOT NULL,
  `prowadzacy_id` int NOT NULL,
  `sala_id` int NOT NULL,
  `klasa_id` int NOT NULL,
  PRIMARY KEY (`zajecia_id`),
  KEY `zajecia_prowadzacy_id_foreign` (`prowadzacy_id`),
  KEY `zajecia_przedmiot_id_foreign` (`przedmiot_id`),
  KEY `zajecia_klasa_id_foreign` (`klasa_id`),
  KEY `zajecia_sala_id_foreign` (`sala_id`),
  CONSTRAINT `zajecia_ibfk_1765` FOREIGN KEY (`przedmiot_id`) REFERENCES `przedmioty` (`przedmiot_id`),
  CONSTRAINT `zajecia_ibfk_1766` FOREIGN KEY (`prowadzacy_id`) REFERENCES `uzytkownik` (`user_id`),
  CONSTRAINT `zajecia_ibfk_1767` FOREIGN KEY (`sala_id`) REFERENCES `sala` (`sala_id`),
  CONSTRAINT `zajecia_ibfk_1768` FOREIGN KEY (`klasa_id`) REFERENCES `klasa` (`klasa_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zajecia`
--

LOCK TABLES `zajecia` WRITE;
/*!40000 ALTER TABLE `zajecia` DISABLE KEYS */;
INSERT INTO `zajecia` VALUES (9,2,19,1,1),(10,1,26,2,1),(11,9,27,3,1),(12,3,28,4,2),(13,11,29,5,2),(14,14,30,6,2);
/*!40000 ALTER TABLE `zajecia` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-01-19  1:39:42
