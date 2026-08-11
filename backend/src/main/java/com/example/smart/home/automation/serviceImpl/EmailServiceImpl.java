package com.example.smart.home.automation.serviceImpl;

import com.example.smart.home.automation.service.EmailService;
import com.example.smart.home.automation.exception.EmailException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private final String fromEmail;
    private final String fromName;
    private final JavaMailSender javaMailSender;

    public EmailServiceImpl(
            @Value("${spring.mail.username}") String fromEmail,
            @Value("${spring.mail.name}") String fromName,
            JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
        this.fromName = fromName;
        this.fromEmail = fromEmail;
    }

    public void send(String toEmail, String subject, String template) {

        try {

            MimeMessage mimeMessage = javaMailSender.createMimeMessage();

            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            mimeMessageHelper.setFrom(String.format("%s <%s>", fromName, fromEmail));

            mimeMessageHelper.setTo(toEmail);

            mimeMessageHelper.setSubject(subject);

            mimeMessageHelper.setText(template, true);

            javaMailSender.send(mimeMessage);

        } catch (MessagingException e) {

            throw new EmailException("Failed To Send Email!");

        }

    }

}