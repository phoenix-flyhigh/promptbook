import { render , screen} from "@testing-library/react";
import Feed from  "@/components/Feed";

describe("Feed component tests", () => {
    it("Should render the feed", () => {
        render (<Feed/>);
        
        expect(screen.getByText("FeedView")).toBeInTheDocument()
    })
})