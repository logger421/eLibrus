CREATE TABLE `zadanie_domowe`(
    `zadanie_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `zajecia_id` BIGINT NOT NULL,
    `termin_oddania` DATE NOT NULL,
    `tytul` VARCHAR(255) NOT NULL,
    `opis` TEXT NOT NULL
);
ALTER TABLE
    `zadanie_domowe` ADD PRIMARY KEY `zadanie_domowe_zadanie_id_primary`(`zadanie_id`);
CREATE TABLE `wiadomosc`(
    `wiadomosc_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nadawca_id` BIGINT NOT NULL,
    `odbiorca_id` BIGINT NOT NULL,
    `typ` VARCHAR(255) NOT NULL,
    `data` DATE NOT NULL,
    `tytul` VARCHAR(255) NOT NULL,
    `tresc` TEXT NOT NULL,
    `odczytana` TINYINT(1) NOT NULL
);
ALTER TABLE
    `wiadomosc` ADD PRIMARY KEY `wiadomosc_wiadomosc_id_primary`(`wiadomosc_id`);
CREATE TABLE `oceny`(
    `ocena_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `ocena` INT NOT NULL,
    `user_id` BIGINT NOT NULL,
    `zajecia_id` BIGINT NOT NULL
);
ALTER TABLE
    `oceny` ADD PRIMARY KEY `oceny_ocena_id_primary`(`ocena_id`);
CREATE TABLE `frekwencja`(
    `zajecia_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `user_id` BIGINT NOT NULL,
    `data_zajec` DATE NOT NULL,
    `frekwencja` VARCHAR(255) NOT NULL
);
CREATE TABLE `rodzicielstwo`(
    `dziecko_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `rodzic_id` BIGINT NOT NULL
);
CREATE TABLE `wychowawcy`(
    `nauczyciel_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `klasa_id` BIGINT NOT NULL
);
ALTER TABLE
    `wychowawcy` ADD PRIMARY KEY `wychowawcy_nauczyciel_id_primary`(`nauczyciel_id`);
CREATE TABLE `sala`(
    `sala_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nazwa` VARCHAR(255) NOT NULL
);
ALTER TABLE
    `sala` ADD PRIMARY KEY `sala_sala_id_primary`(`sala_id`);
CREATE TABLE `przedmioty`(
    `przedmiot_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nazwa` VARCHAR(255) NOT NULL
);
ALTER TABLE
    `przedmioty` ADD PRIMARY KEY `przedmioty_przedmiot_id_primary`(`przedmiot_id`);
CREATE TABLE `zajecia`(
    `zajecia_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `dzien` VARCHAR(255) NOT NULL,
    `nr_lekcji` BIGINT NOT NULL,
    `przedmiot_id` BIGINT NOT NULL,
    `prowadzacy_id` BIGINT NOT NULL,
    `sala_id` BIGINT NOT NULL
);
ALTER TABLE
    `zajecia` ADD PRIMARY KEY `zajecia_zajecia_id_primary`(`zajecia_id`);
CREATE TABLE `plan_zajec`(
    `plan_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `klasa_id` BIGINT NOT NULL,
    `zajecia_id` BIGINT NOT NULL
);
ALTER TABLE
    `plan_zajec` ADD PRIMARY KEY `plan_zajec_plan_id_primary`(`plan_id`);
CREATE TABLE `klasa`(
    `klasa_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `uczen_id` BIGINT NOT NULL
);
ALTER TABLE
    `klasa` ADD PRIMARY KEY `klasa_klasa_id_primary`(`klasa_id`);
CREATE TABLE `rola`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `nazwa` VARCHAR(255) NOT NULL
);
ALTER TABLE
    `rola` ADD PRIMARY KEY `rola_id_primary`(`id`);
CREATE TABLE `uzytkownik`(
    `user_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `imie` VARCHAR(255) NOT NULL,
    `nazwisko` VARCHAR(255) NOT NULL,
    `pesel` VARCHAR(255) NOT NULL,
    `data_urodzenia` DATE NOT NULL,
    `miasto` VARCHAR(255) NOT NULL,
    `kod_pocztowy` VARCHAR(255) NOT NULL,
    `ulica` VARCHAR(255) NOT NULL,
    `nr_mieszkania` VARCHAR(255) NOT NULL,
    `rola` INT NOT NULL,
    `aktywny` TINYINT(1) NOT NULL
);
ALTER TABLE
    `uzytkownik` ADD PRIMARY KEY `uzytkownik_user_id_primary`(`user_id`);
ALTER TABLE
    `rodzicielstwo` ADD CONSTRAINT `rodzicielstwo_dziecko_id_foreign` FOREIGN KEY(`dziecko_id`) REFERENCES `uzytkownik`(`user_id`);
ALTER TABLE
    `klasa` ADD CONSTRAINT `klasa_uczen_id_foreign` FOREIGN KEY(`uczen_id`) REFERENCES `uzytkownik`(`user_id`);
ALTER TABLE
    `rodzicielstwo` ADD CONSTRAINT `rodzicielstwo_rodzic_id_foreign` FOREIGN KEY(`rodzic_id`) REFERENCES `uzytkownik`(`user_id`);
ALTER TABLE
    `zajecia` ADD CONSTRAINT `zajecia_prowadzacy_id_foreign` FOREIGN KEY(`prowadzacy_id`) REFERENCES `uzytkownik`(`user_id`);
ALTER TABLE
    `frekwencja` ADD CONSTRAINT `frekwencja_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `uzytkownik`(`user_id`);
ALTER TABLE
    `wiadomosc` ADD CONSTRAINT `wiadomosc_nadawca_id_foreign` FOREIGN KEY(`nadawca_id`) REFERENCES `uzytkownik`(`user_id`);
ALTER TABLE
    `wiadomosc` ADD CONSTRAINT `wiadomosc_odbiorca_id_foreign` FOREIGN KEY(`odbiorca_id`) REFERENCES `uzytkownik`(`user_id`);
ALTER TABLE
    `oceny` ADD CONSTRAINT `oceny_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `uzytkownik`(`user_id`);
ALTER TABLE
    `uzytkownik` ADD CONSTRAINT `uzytkownik_rola_foreign` FOREIGN KEY(`rola`) REFERENCES `rola`(`id`);
ALTER TABLE
    `zadanie_domowe` ADD CONSTRAINT `zadanie_domowe_zajecia_id_foreign` FOREIGN KEY(`zajecia_id`) REFERENCES `zajecia`(`zajecia_id`);
ALTER TABLE
    `frekwencja` ADD CONSTRAINT `frekwencja_zajecia_id_foreign` FOREIGN KEY(`zajecia_id`) REFERENCES `zajecia`(`zajecia_id`);
ALTER TABLE
    `oceny` ADD CONSTRAINT `oceny_zajecia_id_foreign` FOREIGN KEY(`zajecia_id`) REFERENCES `zajecia`(`zajecia_id`);
ALTER TABLE
    `zajecia` ADD CONSTRAINT `zajecia_przedmiot_id_foreign` FOREIGN KEY(`przedmiot_id`) REFERENCES `przedmioty`(`przedmiot_id`);
ALTER TABLE
    `plan_zajec` ADD CONSTRAINT `plan_zajec_klasa_id_foreign` FOREIGN KEY(`klasa_id`) REFERENCES `klasa`(`klasa_id`);
ALTER TABLE
    `plan_zajec` ADD CONSTRAINT `plan_zajec_zajecia_id_foreign` FOREIGN KEY(`zajecia_id`) REFERENCES `zajecia`(`zajecia_id`);
ALTER TABLE
    `wychowawcy` ADD CONSTRAINT `wychowawcy_klasa_id_foreign` FOREIGN KEY(`klasa_id`) REFERENCES `klasa`(`klasa_id`);
ALTER TABLE
    `zajecia` ADD CONSTRAINT `zajecia_sala_id_foreign` FOREIGN KEY(`sala_id`) REFERENCES `sala`(`sala_id`);