package com.PDOAReplayer.PDOA.Repositories.Interfaces;

import com.PDOAReplayer.PDOA.Entities.ERole;
import com.PDOAReplayer.PDOA.Entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RolesRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole name);

    //TODO: add method that sets a role to a user - setRole(int roleID, int userID)
}
