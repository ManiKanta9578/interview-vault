package com.manikanta.interviewvault.service;


import com.manikanta.interviewvault.dto.AuthResponse;
import com.manikanta.interviewvault.dto.LoginRequest;
import com.manikanta.interviewvault.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
