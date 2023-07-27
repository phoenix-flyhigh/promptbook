import { render , screen} from "@testing-library/react";
import NavBar from  "@/components/NavBar";

describe("NavBar component tests", () => {
    it("Should render the nav bar", () => {
        render (<NavBar/>);
        
        expect(screen.getByText("NavBarView")).toBeInTheDocument()
    })
})