package com.PDOAReplayer.PDOA.Repositories.Interfaces;

import com.PDOAReplayer.PDOA.Entities.Users;
import org.apache.catalina.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UsersRepository extends JpaRepository<Users, Long> {
}
