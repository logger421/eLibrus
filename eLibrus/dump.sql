-- MySQL dump 10.13  Distrib 8.0.31, for Linux (x86_64)
--
-- Host: localhost    Database: eDziennik_2
-- ------------------------------------------------------
-- Server version	8.0.31-0ubuntu0.20.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `data_zajec`
--

LOCK TABLES `data_zajec` WRITE;
/*!40000 ALTER TABLE `data_zajec` DISABLE KEYS */;
INSERT INTO `data_zajec` VALUES (3,'Sroda',1,2);
INSERT INTO `data_zajec` VALUES (4,'Poniedzialek',2,3);
INSERT INTO `data_zajec` VALUES (5,'Piatek',3,4);
INSERT INTO `data_zajec` VALUES (6,'Sroda',5,5);
INSERT INTO `data_zajec` VALUES (7,'Poniedzialek',3,1);
INSERT INTO `data_zajec` VALUES (10,'Poniedzialek',1,5);
INSERT INTO `data_zajec` VALUES (11,'Sroda',4,5);
INSERT INTO `data_zajec` VALUES (13,'Poniedzialek',2,5);
INSERT INTO `data_zajec` VALUES (14,'Poniedzialek',1,7);
INSERT INTO `data_zajec` VALUES (15,'Poniedzialek',5,5);
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
  CONSTRAINT `frekwencja_ibfk_1003` FOREIGN KEY (`zajecia_id`) REFERENCES `zajecia` (`zajecia_id`),
  CONSTRAINT `frekwencja_ibfk_1004` FOREIGN KEY (`user_id`) REFERENCES `uzytkownik` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `frekwencja`
--

LOCK TABLES `frekwencja` WRITE;
/*!40000 ALTER TABLE `frekwencja` DISABLE KEYS */;
INSERT INTO `frekwencja` VALUES (2,1,'2023-01-18','U',1,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `klasa`
--

LOCK TABLES `klasa` WRITE;
/*!40000 ALTER TABLE `klasa` DISABLE KEYS */;
INSERT INTO `klasa` VALUES (1,3);
INSERT INTO `klasa` VALUES (2,3);
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
  CONSTRAINT `oceny_ibfk_1003` FOREIGN KEY (`user_id`) REFERENCES `uzytkownik` (`user_id`),
  CONSTRAINT `oceny_ibfk_1004` FOREIGN KEY (`zajecia_id`) REFERENCES `zajecia` (`zajecia_id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `oceny`
--

LOCK TABLES `oceny` WRITE;
/*!40000 ALTER TABLE `oceny` DISABLE KEYS */;
INSERT INTO `oceny` VALUES (2,4,1,2);
INSERT INTO `oceny` VALUES (3,5,1,3);
INSERT INTO `oceny` VALUES (9,4,5,1);
INSERT INTO `oceny` VALUES (10,5,5,1);
INSERT INTO `oceny` VALUES (17,4,1,2);
INSERT INTO `oceny` VALUES (18,4,5,2);
INSERT INTO `oceny` VALUES (19,1,1,2);
INSERT INTO `oceny` VALUES (20,1,5,2);
INSERT INTO `oceny` VALUES (21,1,1,2);
INSERT INTO `oceny` VALUES (22,1,5,2);
INSERT INTO `oceny` VALUES (37,3,5,1);
INSERT INTO `oceny` VALUES (38,1,1,2);
INSERT INTO `oceny` VALUES (39,1,5,2);
INSERT INTO `oceny` VALUES (40,5,1,2);
INSERT INTO `oceny` VALUES (41,5,5,2);
INSERT INTO `oceny` VALUES (43,5,5,1);
INSERT INTO `oceny` VALUES (44,6,1,1);
INSERT INTO `oceny` VALUES (45,5,1,1);
INSERT INTO `oceny` VALUES (46,4,5,1);
INSERT INTO `oceny` VALUES (47,1,5,1);
INSERT INTO `oceny` VALUES (49,5,5,4);
INSERT INTO `oceny` VALUES (50,4,1,4);
INSERT INTO `oceny` VALUES (52,5,1,1);
INSERT INTO `oceny` VALUES (53,5,5,1);
INSERT INTO `oceny` VALUES (55,3,5,4);
INSERT INTO `oceny` VALUES (56,4,1,4);
INSERT INTO `oceny` VALUES (57,1,1,4);
INSERT INTO `oceny` VALUES (58,1,5,4);
INSERT INTO `oceny` VALUES (59,4,1,4);
INSERT INTO `oceny` VALUES (60,4,5,4);
INSERT INTO `oceny` VALUES (61,5,1,4);
INSERT INTO `oceny` VALUES (62,5,5,4);
INSERT INTO `oceny` VALUES (63,5,1,4);
INSERT INTO `oceny` VALUES (64,5,1,1);
INSERT INTO `oceny` VALUES (65,5,5,4);
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ogloszenia`
--

LOCK TABLES `ogloszenia` WRITE;
/*!40000 ALTER TABLE `ogloszenia` DISABLE KEYS */;
INSERT INTO `ogloszenia` VALUES (1,'template','ldasjdlasjdlajdlaksjdlkajdlkasj');
INSERT INTO `ogloszenia` VALUES (2,'test2','dolskajdklajdlaskjdlasjkd');
INSERT INTO `ogloszenia` VALUES (3,'test','test');
INSERT INTO `ogloszenia` VALUES (4,'dsadas','dsadas');
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
INSERT INTO `przedmioty` VALUES (1,'j. Polski');
INSERT INTO `przedmioty` VALUES (2,'Matematyka');
INSERT INTO `przedmioty` VALUES (3,'Biologia');
INSERT INTO `przedmioty` VALUES (4,'Chemia');
INSERT INTO `przedmioty` VALUES (5,'Fizyka');
INSERT INTO `przedmioty` VALUES (6,'Geografia');
INSERT INTO `przedmioty` VALUES (7,'Historia');
INSERT INTO `przedmioty` VALUES (8,'Informatyka');
INSERT INTO `przedmioty` VALUES (9,'j. Angielski');
INSERT INTO `przedmioty` VALUES (10,'j. Niemiecki');
INSERT INTO `przedmioty` VALUES (11,'Muzyka');
INSERT INTO `przedmioty` VALUES (12,'Plastyka');
INSERT INTO `przedmioty` VALUES (13,'WOS');
INSERT INTO `przedmioty` VALUES (14,'Technika');
INSERT INTO `przedmioty` VALUES (15,'Wychowanie fizyczne');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rodzicielstwo`
--

LOCK TABLES `rodzicielstwo` WRITE;
/*!40000 ALTER TABLE `rodzicielstwo` DISABLE KEYS */;
INSERT INTO `rodzicielstwo` VALUES (1,2,1);
INSERT INTO `rodzicielstwo` VALUES (5,2,2);
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
INSERT INTO `sala` VALUES (1,'A1');
INSERT INTO `sala` VALUES (2,'A2');
INSERT INTO `sala` VALUES (3,'A3');
INSERT INTO `sala` VALUES (4,'B1');
INSERT INTO `sala` VALUES (5,'B2');
INSERT INTO `sala` VALUES (6,'B3');
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `uzytkownik`
--

LOCK TABLES `uzytkownik` WRITE;
/*!40000 ALTER TABLE `uzytkownik` DISABLE KEYS */;
INSERT INTO `uzytkownik` VALUES (1,'jan.kowalski@student.dziennikuj.pl','uczen123','Jan','Kowalski','12312312312','2000-05-03','Krakow','30-302','Ludowa','23/3','1',1,1);
INSERT INTO `uzytkownik` VALUES (2,'joanna.kowalska@rodzic.dziennikuj.pl','rodzic123','Joanna','Kowalska','12312312312','1990-02-01','Krakow','30-302','Ludowa','23/3','2',NULL,1);
INSERT INTO `uzytkownik` VALUES (3,'pawel.kowal@nauczyciel.dziennikuj.pl','nauczyciel123','Pawel','Kowal','12312312312','1996-01-04','Krakow','30-302','Gwarna','11/1','3',NULL,1);
INSERT INTO `uzytkownik` VALUES (4,'dominik.mazurek@administrator.dziennikuj.pl','administrator123','Dominik','Mazurek','12312312315','1992-07-12','Krakow','30-307','Lubuska','33/17','4',NULL,1);
INSERT INTO `uzytkownik` VALUES (5,'jakub.kowal@student.dziennikuj.pl','uczen123','Jakub','Kowal','12312312312','1999-01-01','Krakow','30-302','Ludowa','23/3','1',2,1);
INSERT INTO `uzytkownik` VALUES (6,'pawel1.kowal@nauczyciel.dziennikuj.pl','nauczyciel123','Pawel1','Kowal','12312312312','1996-01-04','Krakow','30-302','Gwarna','11/1','3',NULL,1);
INSERT INTO `uzytkownik` VALUES (7,'pawel2.kowal@nauczyciel.dziennikuj.pl','nauczyciel123','Pawel2','Kowal','12312312312','1996-01-04','Krakow','30-302','Gwarna','11/1','3',NULL,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wiadomosc`
--

LOCK TABLES `wiadomosc` WRITE;
/*!40000 ALTER TABLE `wiadomosc` DISABLE KEYS */;
INSERT INTO `wiadomosc` VALUES (21,1,1,'2','2023-01-18','Twoje oceny z przedmiotu j. Polski uległy zmianie',NULL,0,0);
INSERT INTO `wiadomosc` VALUES (22,5,5,'2','2023-01-18','Twoje oceny z przedmiotu j. Polski uległy zmianie',NULL,0,0);
INSERT INTO `wiadomosc` VALUES (23,1,1,'2','2023-01-18','Twoje oceny z przedmiotu j. Polski uległy zmianie',NULL,0,0);
INSERT INTO `wiadomosc` VALUES (24,1,1,'2','2023-01-18','Pojawiła się nowa praca domowa z przedmiotu Matematyka',NULL,0,0);
INSERT INTO `wiadomosc` VALUES (25,1,1,'2','2023-01-18','Twoje oceny z przedmiotu j. Polski uległy zmianie',NULL,0,0);
INSERT INTO `wiadomosc` VALUES (26,2,2,'2','2023-01-18','Oceny dziecka Jan Kowalski uległy zmianie',NULL,0,0);
INSERT INTO `wiadomosc` VALUES (27,5,5,'2','2023-01-18','Twoje oceny z przedmiotu j. Polski uległy zmianie',NULL,0,0);
INSERT INTO `wiadomosc` VALUES (28,2,2,'2','2023-01-18','Oceny dziecka Jakub Kowal uległy zmianie',NULL,0,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zadanie_domowe`
--

LOCK TABLES `zadanie_domowe` WRITE;
/*!40000 ALTER TABLE `zadanie_domowe` DISABLE KEYS */;
INSERT INTO `zadanie_domowe` VALUES (14,2,'2023-01-19','siema','siema');
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
  CONSTRAINT `zajecia_ibfk_1969` FOREIGN KEY (`przedmiot_id`) REFERENCES `przedmioty` (`przedmiot_id`),
  CONSTRAINT `zajecia_ibfk_1970` FOREIGN KEY (`prowadzacy_id`) REFERENCES `uzytkownik` (`user_id`),
  CONSTRAINT `zajecia_ibfk_1971` FOREIGN KEY (`sala_id`) REFERENCES `sala` (`sala_id`),
  CONSTRAINT `zajecia_ibfk_1972` FOREIGN KEY (`klasa_id`) REFERENCES `klasa` (`klasa_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `zajecia`
--

LOCK TABLES `zajecia` WRITE;
/*!40000 ALTER TABLE `zajecia` DISABLE KEYS */;
INSERT INTO `zajecia` VALUES (1,1,3,1,1);
INSERT INTO `zajecia` VALUES (2,2,3,3,1);
INSERT INTO `zajecia` VALUES (3,3,3,6,1);
INSERT INTO `zajecia` VALUES (4,1,3,2,2);
INSERT INTO `zajecia` VALUES (5,2,3,4,2);
INSERT INTO `zajecia` VALUES (7,6,3,2,1);
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

-- Dump completed on 2023-01-18 19:47:34
