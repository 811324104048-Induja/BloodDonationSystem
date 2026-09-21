package com.blooddonation.dto;

public class AuthResponse {

    private String message;
    private String token;
    private UserResponse user;

    public AuthResponse(
            String message,
            String token,
            UserResponse user) {

        this.message = message;
        this.token = token;
        this.user = user;
    }

    public String getMessage() {
        return message;
    }

    public String getToken() {
        return token;
    }

    public UserResponse getUser() {
        return user;
    }

    public static class UserResponse {

        private Integer id;
        private String name;
        private String email;
        private String role;

        public UserResponse(
                Integer id,
                String name,
                String email,
                String role) {

            this.id = id;
            this.name = name;
            this.email = email;
            this.role = role;
        }

        public Integer getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public String getEmail() {
            return email;
        }

        public String getRole() {
            return role;
        }
    }
}