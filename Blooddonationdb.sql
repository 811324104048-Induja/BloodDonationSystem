CREATE DATABASE BloodDonationDB;
USE BloodDonationDB;
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    role ENUM('DONOR', 'PATIENT', 'ADMIN') DEFAULT 'DONOR',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE donors (
    donor_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL UNIQUE,

    age INT NOT NULL,

    gender VARCHAR(20),

    blood_group ENUM(
        'A+','A-',
        'B+','B-',
        'AB+','AB-',
        'O+','O-'
    ) NOT NULL,

    city VARCHAR(100) NOT NULL,

    address VARCHAR(255),

    available BOOLEAN DEFAULT TRUE,

    last_donation_date DATE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);
CREATE TABLE otp_verifications (
    id BIGINT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE hospitals (
    hospital_id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(150) NOT NULL,

    phone VARCHAR(15),

    email VARCHAR(100),

    address VARCHAR(255),

    city VARCHAR(100) NOT NULL,

    latitude DECIMAL(10,8),

    longitude DECIMAL(11,8),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE matches (
    match_id INT AUTO_INCREMENT PRIMARY KEY,

    request_id INT NOT NULL,

    donor_id INT NOT NULL,

    compatibility_score DECIMAL(5,2),

    distance_km DECIMAL(8,2),

    urgency_score DECIMAL(5,2),

    availability_score DECIMAL(5,2),

    final_score DECIMAL(5,2),

    match_reason VARCHAR(500),

    status ENUM(
        'PENDING',
        'NOTIFIED',
        'ACCEPTED',
        'REJECTED',
        'COMPLETED',
        'EXPIRED'
    ) DEFAULT 'PENDING',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (request_id)
        REFERENCES blood_requests(request_id)
        ON DELETE CASCADE,

    FOREIGN KEY (donor_id)
        REFERENCES donors(donor_id)
        ON DELETE CASCADE,

    UNIQUE(request_id, donor_id)
);

CREATE TABLE notifications (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    request_id INT,

    title VARCHAR(150) NOT NULL,

    message VARCHAR(500) NOT NULL,

    type ENUM(
        'EMERGENCY_REQUEST',
        'MATCH_FOUND',
        'DONATION_REMINDER',
        'REQUEST_UPDATE',
        'SYSTEM'
    ) DEFAULT 'SYSTEM',

    is_read BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    FOREIGN KEY (request_id)
        REFERENCES blood_requests(request_id)
        ON DELETE SET NULL
);
CREATE TABLE audit_logs (
    log_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id INT,

    action VARCHAR(100) NOT NULL,

    entity_type VARCHAR(50),

    entity_id INT,

    ip_address VARCHAR(45),

    description VARCHAR(500),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
);
CREATE TABLE refresh_tokens (
    token_id BIGINT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    token_hash VARCHAR(255) NOT NULL,

    expires_at DATETIME NOT NULL,

    revoked BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);
CREATE INDEX idx_donor_blood_group
ON donors(blood_group);
CREATE INDEX idx_donor_available
ON donors(available);
CREATE INDEX idx_donor_city
ON donors(city);
CREATE INDEX idx_request_blood_group
ON blood_requests(blood_group);
CREATE INDEX idx_request_status
ON blood_requests(status);
CREATE INDEX idx_request_urgency
ON blood_requests(urgency);
CREATE INDEX idx_request_city
ON blood_requests(city);
CREATE INDEX idx_match_request
ON matches(request_id);
CREATE INDEX idx_match_donor
ON matches(donor_id);
CREATE INDEX idx_match_score
ON matches(final_score);


CREATE TABLE donation_history (
    donation_id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT NOT NULL,
    donation_date DATE,
    units_donated INT,
    hospital_name VARCHAR(255),
    created_at DATETIME
);



CREATE TABLE patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    hospital_name VARCHAR(150),
    city VARCHAR(100),
    address VARCHAR(255),
    created_at DATETIME,
    updated_at DATETIME,
    CONSTRAINT fk_patient_user FOREIGN KEY (user_id)
        REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE blood_requests (
    request_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_id INT NOT NULL,
    blood_group VARCHAR(20) NOT NULL,
    units_required INT NOT NULL,
    hospital_name VARCHAR(150) NOT NULL,
    city VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    urgency VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
    required_date DATE,
    description VARCHAR(500),
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    matched_donor_id INT,
    created_at DATETIME,
    updated_at DATETIME,
    CONSTRAINT fk_request_patient FOREIGN KEY (patient_id)
        REFERENCES patients(patient_id) ON DELETE CASCADE,
    CONSTRAINT fk_request_donor FOREIGN KEY (matched_donor_id)
        REFERENCES donors(donor_id) ON DELETE SET NULL
);
select *from users;
select  *from donors;
select  *from blood_requests;
SELECT * FROM otp_verifications;

 
